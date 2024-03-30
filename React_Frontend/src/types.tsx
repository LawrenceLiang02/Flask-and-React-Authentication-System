export interface Log {
    event_time: string;
    event_type: string;
    log_id: string;
    user_id: string;
    username: string;
  }


  export interface User {
    user_id: number;
    username: string;
    user_role: string;
  }