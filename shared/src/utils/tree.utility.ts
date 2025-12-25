// generic-tree.ts

/**
 * An interface to ensure that items have an `id` and a `parentID`.
 * For root nodes, `parentID` should be `null`.
 */
export interface Identifiable {
  id: string;
  parentID: string | null;
}

/**
 * A generic tree node.
 */
export interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
}

/**
 * A collection of static utility methods for working with tree structures.
 */
export class TreeUtils {
  /**
   * Returns all descendant IDs (including the target node) for the node with the given targetId.
   * If the target is not found, returns an array with just the targetId.
   *
   * @param tree - The tree (or forest) to search.
   * @param targetId - The ID of the target node.
   * @returns An array of IDs.
   */
  static getAllDescendantIds<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string | null
  ): string[] {
    if (!targetId) return [];
    const subtree = TreeUtils.getSubTreeById(tree, targetId);
    if (!subtree) return [targetId];

    const ids: string[] = [];
    for (const item of TreeUtils.iterateTree([subtree])) {
      ids.push(item.id);
    }
    return ids;
  }

  /**
   * Returns a list of ancestor IDs, starting from the target node and going up to the root.
   * The list does not include the targetId itself, and the first element is null (representing the root level).
   *
   * @param tree - The tree to search.
   * @param targetId - The ID of the target node.
   * @returns An array of ancestor IDs, or an empty array if the targetId is not found.
   */
  static getAncestors<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string
  ): Array<string | null> {
    const ancestors: Array<string | null> = [];

    const findAncestors = (
      nodes: TreeNode<T>[],
      currentId: string
    ): boolean => {
      for (const node of nodes) {
        if (node.data.id === currentId && node.data.parentID === null) {
          ancestors.unshift(node.data.parentID);
          return true;
        }
        if (node.data.id === currentId) {
          ancestors.unshift(node.data.parentID);
          return true;
        }
        const foundInChildren = findAncestors(node.children, currentId);
        if (foundInChildren) {
          if (node.data.parentID === null) {
            ancestors.unshift(node.data.parentID);
          }
          return true;
        }
      }
      return false;
    };

    findAncestors(tree, targetId);
    return ancestors;
  }

  /**
   * Builds a tree (or forest) from a Map of items.
   * Optionally, a comparator can be provided to sort the items.
   *
   * @param itemMap - A map of items.
   * @param comparator - Optional comparator for sorting the items.
   * @returns An array of root TreeNodes.
   */
  static createTree<T extends Identifiable>(
    itemMap: Map<string, T>,
    comparator?: (a: T, b: T) => number
  ): TreeNode<T>[] {
    // Convert the map to an array and sort if needed
    let items = Array.from(itemMap.values());
    if (comparator) {
      items.sort(comparator);
    }

    const nodeMap = new Map<string, TreeNode<T>>();
    const roots: TreeNode<T>[] = [];

    // Create a TreeNode for each item
    for (const item of items) {
      nodeMap.set(item.id, { data: item, children: [] });
    }

    // Link each node to its parent if possible;
    // otherwise, treat it as a root node.
    for (const node of nodeMap.values()) {
      const parentID = node.data.parentID;
      if (parentID !== null && nodeMap.has(parentID)) {
        nodeMap.get(parentID)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /**
   * A generator function to traverse the tree depth-first.
   *
   * @param tree - The tree to iterate over.
   */
  static *iterateTree<T>(tree: TreeNode<T>[]): Iterable<T> {
    for (const node of tree) {
      yield node.data;
      yield* TreeUtils.iterateTree(node.children);
    }
  }

  /**
   * Returns the subtree (i.e. the TreeNode) for the given targetId.
   * If targetId is null, returns the first root node (if any).
   *
   * @param tree - The tree (or forest) to search.
   * @param targetId - The target node's ID.
   * @returns The TreeNode matching targetId, or null if not found.
   */
  static getSubTreeById<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string | null
  ): TreeNode<T> | null {
    if (targetId === null) {
      return tree.length > 0 ? tree[0] : null;
    }

    const findSubTree = (
      node: TreeNode<T>,
      targetId: string
    ): TreeNode<T> | null => {
      if (node.data.id === targetId) return node;
      for (const child of node.children) {
        const result = findSubTree(child, targetId);
        if (result) return result;
      }
      return null;
    };

    for (const node of tree) {
      const result = findSubTree(node, targetId);
      if (result) return result;
    }
    return null;
  }

  /**
   * Returns the path (as an array of IDs) from the root to the node with targetId.
   * The returned path is prefixed with `null` (representing the root level).
   *
   * @param tree - The tree to search.
   * @param targetId - The target node's ID.
   * @returns An array of IDs (with null as the first element).
   */
  static getPath<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string | null
  ): Array<string | null> {
    if (targetId === null) {
      return [null];
    }

    const findPath = (
      nodes: TreeNode<T>[],
      targetId: string,
      currentPath: Array<string | null>
    ): Array<string | null> | null => {
      for (const node of nodes) {
        if (node.data.id === targetId) {
          return [...currentPath, node.data.id];
        }

        const pathInChildren = findPath(node.children, targetId, [
          ...currentPath,
          node.data.id,
        ]);
        if (pathInChildren) {
          return pathInChildren;
        }
      }
      return null;
    };

    for (const node of tree) {
      const result = findPath([node], targetId, [null]); // Start with null as the root
      if (result) return result;
    }
    return [null]; // Target not found, return [null]
  }

  /**
   * Returns the total number of nodes in the tree.
   *
   * @param tree - The tree to count nodes in.
   * @returns The node count.
   */
  static countNodes<T>(tree: TreeNode<T>[]): number {
    let count = 0;
    for (const _ of TreeUtils.iterateTree(tree)) {
      count++;
    }
    return count;
  }

  /**
   * Returns the depth (level) of the node with targetId.
   * Root nodes are at level 0. Returns -1 if the node is not found.
   *
   * @param tree - The tree to search.
   * @param targetId - The target node's ID.
   * @returns The level of the node, or -1 if not found.
   */
  static getLevel<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string
  ): number {
    const findLevel = (nodes: TreeNode<T>[], currentLevel: number): number => {
      for (const node of nodes) {
        if (node.data.id === targetId) {
          return currentLevel;
        }
        const childLevel = findLevel(node.children, currentLevel + 1);
        if (childLevel !== -1) return childLevel;
      }
      return -1;
    };
    return findLevel(tree, 0);
  }

  /**
   * Finds and returns the first node in the tree that satisfies the given predicate.
   *
   * @param tree - The tree to search.
   * @param predicate - A function that returns true for the desired node.
   * @returns The matching TreeNode or null if none match.
   */
  static findNode<T>(
    tree: TreeNode<T>[],
    predicate: (data: T) => boolean
  ): TreeNode<T> | null {
    for (const node of tree) {
      if (predicate(node.data)) return node;
      const found = TreeUtils.findNode(node.children, predicate);
      if (found) return found;
    }
    return null;
  }

  /**
   * Executes a callback for each node in the tree (depth-first).
   *
   * @param tree - The tree to traverse.
   * @param callback - The function to execute on each node's data.
   */
  static forEach<T>(tree: TreeNode<T>[], callback: (data: T) => void): void {
    for (const node of tree) {
      callback(node.data);
      TreeUtils.forEach(node.children, callback);
    }
  }

  /**
   * Creates a new tree by mapping each node's data using the provided function.
   * The structure of the tree is preserved.
   *
   * @param tree - The original tree.
   * @param mapFn - The mapping function.
   * @returns A new tree with mapped data.
   */
  static mapTree<T, U>(
    tree: TreeNode<T>[],
    mapFn: (data: T) => U
  ): TreeNode<U>[] {
    return tree.map((node) => ({
      data: mapFn(node.data),
      children: TreeUtils.mapTree(node.children, mapFn),
    }));
  }

  /**
   * Inserts a new node into the tree based on its parentID.
   * If newNode.parentID is null, the new node is added as a root.
   * This function returns a new tree and does not modify the original tree.
   *
   * @param tree - The tree to insert into.
   * @param newNode - The new node to insert.
   * @throws Error if the parent is not found.
   * @returns A new tree with the node inserted.
   */
  static insertNode<T extends Identifiable>(
    tree: TreeNode<T>[],
    newNode: T
  ): TreeNode<T>[] {
    // If the new node is a root, simply add it.
    if (newNode.parentID === null) {
      return [...tree, { data: newNode, children: [] }];
    }

    let inserted = false;

    // Recursively search for the parent and insert the new node.
    const recursiveInsert = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
      return nodes.map((node) => {
        if (!inserted && node.data.id === newNode.parentID) {
          inserted = true;
          return {
            data: node.data,
            children: [...node.children, { data: newNode, children: [] }],
          };
        } else {
          return {
            data: node.data,
            children: recursiveInsert(node.children),
          };
        }
      });
    };

    const newTree = recursiveInsert(tree);
    // If the parent was not found, add newNode as a new root.
    if (!inserted) {
      return [...newTree, { data: newNode, children: [] }];
    }
    return newTree;
  }

  /**
   * Removes the node with the given targetId (and its entire subtree) from the tree.
   * Returns a new tree without modifying the original.
   *
   * @param tree - The tree to remove the node from.
   * @param targetId - The ID of the node to remove.
   * @returns A new tree with the node removed.
   */
  static removeNode<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string
  ): TreeNode<T>[] {
    const recursiveRemove = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
      return nodes
        .filter((node) => node.data.id !== targetId)
        .map((node) => ({
          data: node.data,
          children: recursiveRemove(node.children),
        }));
    };
    return recursiveRemove(tree);
  }

  /**
   * Updates the node with the given targetId using the provided update function.
   * Returns a new tree with the update applied.
   *
   * @param tree - The tree containing the node.
   * @param targetId - The ID of the node to update.
   * @param updateFn - A function that receives the old node data and returns the updated data.
   * @returns A new tree with the node updated.
   */
  static updateNode<T extends Identifiable>(
    tree: TreeNode<T>[],
    targetId: string,
    updateFn: (oldData: T) => T
  ): TreeNode<T>[] {
    const recursiveUpdate = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
      return nodes.map((node) => {
        if (node.data.id === targetId) {
          return {
            data: updateFn(node.data),
            children: recursiveUpdate(node.children),
          };
        } else {
          return {
            data: node.data,
            children: recursiveUpdate(node.children),
          };
        }
      });
    };
    return recursiveUpdate(tree);
  }
}
