export interface ITapTimer {
    id?: number;
    tap_id: number;
    project_setting_id: number;
    wirkzeit_status: boolean;
    spulzeit_status: boolean;
    wirkzeit_pending_timer: string | null;
    spulzeit_pending_timer: string | null;
    wirkzeit_timer_started: string | null;
    spulzeit_timer_started: string | null;
}