import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { join } from 'node:path';
import { Node, Root, Type } from './types';

@Injectable()
export class ConfigService {
  createFolderTree(root: Root) {
    if (fs.existsSync(root.path)) {
      this.createFolder(root.path);
    }

    root.children.forEach((node) =>
      this.createFolderTreeHelper(root.path, node),
    );
  }

  private createFolderTreeHelper(path: string, node: Node) {
    const itemPath = join(path, node.name);
    switch (node.type) {
      case Type.File:
        this.createFile(itemPath);
        break;
      case Type.Folder:
        this.createFolder(itemPath);
        node.children.forEach((node) =>
          this.createFolderTreeHelper(itemPath, node),
        );
        break;
    }
  }

  private createFile(path: string, content: string = '') {
    try {
      if (fs.existsSync(path)) return;

      fs.writeFileSync(path, content);
    } catch (e) {
      console.error(`could not create file ${path}\nerror: ${e}`);
    }
  }

  private createFolder(path: string) {
    try {
      if (fs.existsSync(path)) return;

      fs.mkdirSync(path, { recursive: true });
    } catch (e) {
      console.error(`could not create folder ${path}\nerror: ${e}`);
    }
  }
}
