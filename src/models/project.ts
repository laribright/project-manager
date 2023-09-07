export type Project = {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  projectBoards: ProjectBoard[];
};

type ProjectBoard = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  order: number;
  slug: string;
  projectId: string;
  features: Feature[];
};

export interface Feature {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  finishDate: Date;
  order: number;
  projectBoardId: string;
}
