import anime, { AnimeInstance } from "animejs"
import { useState, useEffect } from "react"
import { AnimeParamsWithType } from "../types"

export function initAnimes<
    T extends Partial<Record<string, AnimeParamsWithType>>,
>(animes: T) {
    const [animations, setAnimations] =
        useState<Record<keyof T, AnimeInstance>>()

    useEffect(() => {
        let myAnimes: Partial<Record<keyof T, AnimeInstance>> = {}
        Object.entries(animes).forEach(([animName, animParams]) => {
            if (animParams?.timeline?.length) {
                let tl = anime.timeline(animParams!)
                animParams.timeline.map(tlAdd => {
                    if (tlAdd.offset) {
                        tl.add({ ...tlAdd, offset: undefined }, tlAdd.offset)
                    } else {
                        tl.add(tlAdd)
                    }
                })
                myAnimes[animName as keyof T] = tl
            } else {
                myAnimes[animName as keyof T] = anime(animParams!)
            }
        })
        setAnimations(myAnimes as Record<keyof T, AnimeInstance>)
    }, [])

    return animations
}

export function animationIsRunning(myAnime?: AnimeInstance) {
    return anime.running.some(anim => anim === myAnime)
}

export { anime }
