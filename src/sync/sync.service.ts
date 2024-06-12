import { Injectable } from '@nestjs/common';
import JSZip from 'jszip';

@Injectable()
export class SyncService {
  /**************************************
   ******** Write Sync Records ********
   *************************************/
  writeSyncRecords = async (zipBlob: any) => {
    const jszip = new JSZip();

    try {
      // Extract the zip file
      // Load the zip Blob
      jszip
        .loadAsync(zipBlob)
        .then((zip) => {
          console.log(zip);
          // Iterate through each file in the zip
          // Object.keys(zip.files).forEach(function (filename) {
          //   zip.files[filename].async('blob').then(function (fileData) {
          //     // Handle each extracted file here
          //     console.log('Extracted file:', filename);
          //     console.log('File data:', fileData);
          //   });
          // });
        })
        .catch(function (err) {
          console.error('Error extracting zip:', err);
        });

      console.log('[Sync Service] Sync records written successfully!');
    } catch (error) {
      console.error('[Sync Service] Error writing sync records: ', error);
    }
  };
}
