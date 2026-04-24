export interface Camera {
  id: string;
  title: string;
  slug: string;
  city: string;
  state: string;
  stateCode: string;
  description: string;
  type: 'hls' | 'youtube' | 'embed' | 'portal';
  url: string;
  thumbnail: string;
  views: number;
  tags: string[];
}

export interface City {
  name: string;
  slug: string;
  stateCode: string;
  description: string;
  cameraCount: number;
}

export interface State {
  name: string;
  code: string;
  region: string;
  description: string;
  cities: City[];
}
