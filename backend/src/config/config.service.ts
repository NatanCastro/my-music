import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'node:fs';
import { join } from 'node:path';
import { ItemList, Node, Root, Type } from './types';
import { folderTree } from './data';

@Injectable()
export class ConfigService implements OnModuleInit {
  private itemList: ItemList = new Map();

  onModuleInit() {
    this.createFolderTree(folderTree);
    this.createItemList(folderTree);
  }

  getListItem(key: string) {
    return this.itemList.get(key);
  }

  createItemList(root: Root) {
    root.children.forEach((node) => this.createItemListHelper(root.path, node));
  }

  private createItemListHelper(path: string, node: Node) {
    const itemPath = join(path, node.name);

    switch (node.type) {
      case Type.File:
        if (node.directUsed) this.itemList.set(node.name, itemPath);
        break;

      case Type.Folder:
        if (node.directUsed) this.itemList.set(node.name, itemPath);
        node.children.forEach((node) => {
          this.createItemListHelper(itemPath, node);
        });
        break;
    }
  }

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
