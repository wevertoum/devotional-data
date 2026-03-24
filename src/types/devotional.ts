export type DateSortOrder = "asc" | "desc";

export function isDateSortOrder(v: string | null): v is DateSortOrder {
	return v === "asc" || v === "desc";
}

export type CheckInFilterRule = (checkIn: CheckIn) => boolean;

export interface AccountData {
	messages: unknown[];
	profile: Profile;
	comments: unknown[];
	challenges: unknown[];
	reactions: unknown[];
	check_ins: CheckIn[];
	device_activities: unknown[];
}

export interface Profile {
	id: number;
	full_name: string;
	email: string;
	profile_picture_url: string;
	timezone: string;
	pro: boolean;
	created_at: string;
	updated_at: string;
}

export interface CheckIn {
	id: number;
	version: string;
	description?: string | null;
	title: string;
	timezone: string;
	steps: unknown;
	details?: Details | null;
	duration: unknown;
	updated_at: string;
	points: unknown;
	created_at: string;
	occurred_at: string;
	calories: unknown;
	activity_type: unknown;
	apple_workout_uuid: unknown;
	distance_miles: unknown;
	duration_millis: unknown;
	apple_device_name: unknown;
	apple_source_name: unknown;
	challenge_id: number | null;
	workout_entry_id: number;
	photo_url: string;
	google_place_id: unknown;
	activity_count: number;
	activity_metric_amount: unknown;
	activity_type_id: unknown;
	check_in_activities: CheckInActivity[];
	check_in_media: CheckInMedium[];
}

export interface Details {
	id: number;
	updated_at: string;
	created_at: string;
	workout_id: number;
	location_latitude?: string;
	location_longitude?: string;
}

export interface CheckInActivity {
	id: number;
	steps: unknown;
	start_time: string;
	updated_at: string;
	points: unknown;
	created_at: string;
	calories: unknown;
	distance_miles: unknown;
	duration_millis: unknown;
	workout_id: number;
	platform_activity: unknown;
	activity_metric_amount: unknown;
}

export interface CheckInMedium {
	id: number;
	width: number;
	source: string;
	url: string;
	updated_at: string;
	height: number;
	created_at: string;
	workout_id: number;
	medium_type: string;
	exif_datetime?: string;
	exif_data?: ExifData;
	thumbnail_url: unknown;
	exif_location_latitude: unknown;
	exif_location_longitude: unknown;
}

export interface ExifData {
	date_time_original?: string;
}
