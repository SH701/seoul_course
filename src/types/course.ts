export interface Spot {
  name: string;
  desc: string;
  address?: string;
  stayTime?: string;
  category?: string;
}
export interface Courses {
  totalDuration: string | null | undefined;
  title: string;
  vibe: string | null | undefined;
  route?: string | null | undefined;
  spots: Spot[];
}
