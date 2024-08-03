import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { uploadFilesToBlob } from '@/src/server/uploadFilesToBlob';
import { HttpStatusCode } from 'axios';
import { createNextErrorResponse } from '@/src/server/error';
import { StorageContainerName } from '@/lib/types';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();
    const files = convertToFiles(formData);
    const storageLocation = formData.get('storageLocation') as StorageContainerName;

    let uploadedFileUrls: string[] = [];
    console.log('files', files);
    if (files && files.length > 0) {
      uploadedFileUrls = await uploadFilesToBlob(files, storageLocation);
    }

    return NextResponse.json(
      {
        files: uploadedFileUrls.map((url, index) => ({ url, name: files[index].name })),
        message: 'Your files has been uploaded',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to upload your files:', error);
    return createNextErrorResponse(error);
  }
};

const convertToFiles = (input: FormData): File[] => {
  const files: File[] = [];

  input.forEach((value, key) => {
    if (key === 'files[]') {
      files.push(value as File);
    }
  });

  return files;
};
