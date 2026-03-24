<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;

class GoogleDriveService
{
    protected $drive;
    protected $rootFolderId;

    public function __construct()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/google-credentials.json'));
        $client->addScope(Drive::DRIVE);

        $this->drive = new Drive($client);
        $this->rootFolderId = env('GOOGLE_DRIVE_ROOT_FOLDER_ID');
    }

    protected function getOrCreateFolder(string $folderName, string $parentId): string
    {
        $results = $this->drive->files->listFiles([
            'q' => "name='{$folderName}' and mimeType='application/vnd.google-apps.folder' and '{$parentId}' in parents and trashed=false",
            'fields' => 'files(id, name)',
        ]);

        if (count($results->getFiles()) > 0) {
            return $results->getFiles()[0]->getId();
        }

        $folderMetadata = new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$parentId],
        ]);

        $folder = $this->drive->files->create($folderMetadata, ['fields' => 'id']);
        return $folder->getId();
    }

    public function uploadFile(string $filePath, string $fileName, string $categoryName, string $competitionName): string
    {
        $categoryFolderId = $this->getOrCreateFolder($categoryName, $this->rootFolderId);
        $competitionFolderId = $this->getOrCreateFolder($competitionName, $categoryFolderId);

        $fileMetadata = new DriveFile([
            'name' => $fileName,
            'parents' => [$competitionFolderId],
        ]);

        $content = file_get_contents($filePath);

        $file = $this->drive->files->create($fileMetadata, [
            'data' => $content,
            'mimeType' => 'application/octet-stream',
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        return $file->getId();
    }
}
