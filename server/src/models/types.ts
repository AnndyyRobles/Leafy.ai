// Interfaces para usuario
export interface IUser {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    password?: string;
    registration_date: Date;
  }
  
  export interface IUserLogin {
    email: string;
    password: string;
  }
  
  export interface IUserRegister {
    name: string;
    email: string;
    password: string;
  }
  
  // Para la autenticación
  export interface IAuthRequest extends Request {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }
  export interface ITechnique {
    id: number;
    name: string;
  }

  export interface IPost {
    id: number;
    user_id: number;
    description: string;
    post_picture: string;
    post_date: Date;
    likes: number;
    is_published: boolean;
  }
  
  export interface IPostWithDetails extends IPost {
    user: {
      id: number;
      name: string;
      avatar: string;
    };
    techniques: string[];
    comments: IComment[];
  }
  
  export interface IComment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    comment_date: Date;
    user?: {
      id: number;
      name: string;
      avatar: string;
    };
  }
  
  export interface ICreatePostRequest {
    description: string;
    techniques: number[];
    is_published?: boolean;
  }

  export interface IPlantGuide {
    id: number;
    common_name: string;
    scientific_name: string;
    guide_picture: string;
    description: string;
    germination: string;
    transplanting: string;
    harvest: string;
    watering: string;
    sunlight: string;
    extra_care: string;
    difficulty: string;
    growing_season: string;
    days_to_harvest: string;
    created_at: Date;
  }
  
  export interface IPlantCategory {
    id: number;
    name: string;
  }