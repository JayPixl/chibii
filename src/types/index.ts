import { AnimeAnimParams } from "animejs"

export interface AnimeParamsWithOffset extends AnimeAnimParams {
    offset?: string | number
}

export interface AnimeParamsWithType extends AnimeAnimParams {
    timeline?: AnimeParamsWithOffset[]
}
