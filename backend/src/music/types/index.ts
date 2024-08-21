export type AudioFiles = {
  original: Express.Multer.File;
  compressed: Express.Multer.File;
  extension: string;
};

export type GroupedAudioFiles = Map<string, AudioFiles>;
