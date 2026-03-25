<?php

namespace App\Exports;

use App\Models\Registration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RegistrationsExport implements FromCollection, WithMapping, WithHeadings, WithDrawings, WithStyles, WithColumnWidths
{
    public function collection()
    {
        return Registration::with(['user', 'competition.category', 'members'])
            ->where('payment_status', 'approved')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Kategori',
            'Lomba',
            'Nama Lengkap (Ketua)',
            'Email (Ketua)',
            'WhatsApp (Ketua)',
            'Line ID (Ketua)',
            'Asal Instansi (Ketua)',
            'Nama Anggota',
            'Bukti Pembayaran',
            'Nomor Peserta',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 20,
            'C' => 25,
            'D' => 25,
            'E' => 20,
            'F' => 15,
            'G' => 25,
            'H' => 40,
            'I' => 30,
            'J' => 20,
        ];
    }

    public function map($reg): array
    {
        $listAnggota = $reg->members->count() > 0
            ? $reg->members->map(fn($m) => "- " . $m->name)->implode("\n")
            : '-';

        return [
            $reg->competition->category->name ?? '-',
            $reg->competition->name ?? '-',
            $reg->user->name ?? '-',
            $reg->user->email ?? '-',
            $reg->user->whatsapp ?? 'gada',
            $reg->user->line_id ?? '-',
            $reg->user->instansi ?? 'gada',
            $listAnggota,
            '',
            $reg->participant_code ?? '-',
        ];
    }

    public function drawings()
    {
        $drawings = [];
        foreach ($this->collection() as $index => $reg) {
            if ($reg->payment_proof) {
                $path = public_path('storage/' . $reg->payment_proof);

                if (file_exists($path)) {
                    $drawing = new Drawing();
                    $drawing->setPath($path);
                    $drawing->setHeight(90);
                    $drawing->setCoordinates('I' . ($index + 2));
                    $drawing->setOffsetX(10);
                    $drawing->setOffsetY(5);
                    $drawings[] = $drawing;
                }
            }
        }
        return $drawings;
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('1')->getFont()->setBold(true);
        $sheet->getStyle('A1:J' . $lastRow)->getAlignment()->setVertical('center');
        $sheet->getStyle('H')->getAlignment()->setWrapText(true);
        for ($i = 2; $i <= $lastRow; $i++) {
            $sheet->getRowDimension($i)->setRowHeight(100);
        }
    }
}
