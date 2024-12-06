export interface Root {
  data: any;
  id: any;
  skills: any;
  user: User[];
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  position: string;
  skills: Skill[];
}

export interface Skill {
  title: string;
  level: string;
}
