import anime, { AnimeInstance } from "animejs"
import { useState, useEffect, RefObject, useRef } from "react"
import { AnimeParamsWithType } from "../types"
import { useScrollPercentage } from "react-scroll-percentage"

export function chibii<T extends Partial<Record<string, AnimeParamsWithType>>>(
    animes: T,
) {
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

export function toggleAnimation(myAnime?: AnimeInstance) {
    if (myAnime) {
        if (animationIsRunning(myAnime)) {
            myAnime?.pause()
        } else {
            myAnime.play()
        }
    }
}

export function useViewportScrollAnimation(
    myAnime?: anime.AnimeInstance,
    params?: {
        topMargin?: string | number
        bottomMargin?: string | number
    },
): [(node?: Element | null | undefined) => void, number] {
    const [ref, percentage] = useScrollPercentage({ threshold: 0 })
    let topMargin = 0
    let bottomMargin = 0

    try {
        if (params?.topMargin && window) {
            const tm = params.topMargin
            const rootFontSize = parseFloat(
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("font-size"),
            )

            if (typeof tm === "number") {
                topMargin = tm
            } else if (typeof tm === "string") {
                if (tm.indexOf("%") !== -1) {
                    topMargin = Number(tm.replace("%", "")) / 100
                } else if (
                    tm.indexOf("px") !== -1 &&
                    !Number.isNaN(tm.replace("px", ""))
                ) {
                    topMargin =
                        window.innerHeight / Number(tm.replace("px", "")) / 100
                } else if (
                    tm.indexOf("rem") !== -1 &&
                    !Number.isNaN(tm.replace("rem", ""))
                ) {
                    topMargin =
                        window.innerHeight /
                        (Number(tm.replace("rem", "")) * rootFontSize) /
                        100
                } else if (!Number.isNaN(tm)) {
                    topMargin = Number(tm)
                }
            }
        }

        if (params?.bottomMargin && window) {
            const tm = params.bottomMargin
            const rootFontSize = parseFloat(
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("font-size"),
            )

            if (typeof tm === "number") {
                bottomMargin = tm
            } else if (typeof tm === "string") {
                if (tm.indexOf("%") !== -1) {
                    bottomMargin = Number(tm.replace("%", "")) / 100
                } else if (
                    tm.indexOf("px") !== -1 &&
                    !Number.isNaN(tm.replace("px", ""))
                ) {
                    bottomMargin =
                        window.innerHeight / Number(tm.replace("px", "")) / 100
                } else if (
                    tm.indexOf("rem") !== -1 &&
                    !Number.isNaN(tm.replace("rem", ""))
                ) {
                    bottomMargin =
                        window.innerHeight /
                        (Number(tm.replace("rem", "")) * rootFontSize) /
                        100
                } else if (!Number.isNaN(tm)) {
                    bottomMargin = Number(tm)
                }
            }
        }

        if (bottomMargin + topMargin >= 1) {
            bottomMargin = 0
            topMargin = 0
        }
    } catch (e) {}

    useEffect(() => {
        if (myAnime) {
            let calculatedPercentage = Number(percentage)
            if (topMargin + bottomMargin !== 0) {
                calculatedPercentage =
                    (percentage - (0.5 - (bottomMargin - topMargin) / 2)) /
                        (1 - (topMargin + bottomMargin)) +
                    0.5
            }
            myAnime.seek(myAnime.duration * calculatedPercentage)
        }
    }, [percentage])

    return [ref, Number(percentage)]
}

export function useWindowScrollAnimation(
    myAnime?: anime.AnimeInstance,
    params?: {
        topMargin?: string | number
        bottomMargin?: string | number
    },
): [number] {
    const pct = useRef(0)
    let topMargin = 0
    let bottomMargin = 0

    try {
        if (params?.topMargin && window) {
            const tm = params.topMargin
            const rootFontSize = parseFloat(
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("font-size"),
            )

            if (typeof tm === "number") {
                topMargin = tm
            } else if (typeof tm === "string") {
                if (tm.indexOf("%") !== -1) {
                    topMargin = Number(tm.replace("%", "")) / 100
                } else if (
                    tm.indexOf("px") !== -1 &&
                    !Number.isNaN(tm.replace("px", ""))
                ) {
                    topMargin =
                        Number(tm.replace("px", "")) / window.innerHeight
                } else if (
                    tm.indexOf("rem") !== -1 &&
                    !Number.isNaN(tm.replace("rem", ""))
                ) {
                    topMargin =
                        (Number(tm.replace("rem", "")) * rootFontSize) /
                        window.innerHeight
                } else if (!Number.isNaN(tm)) {
                    topMargin = Number(tm)
                }
            }
        }

        if (params?.bottomMargin && window) {
            const tm = params.bottomMargin
            const rootFontSize = parseFloat(
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("font-size"),
            )

            if (typeof tm === "number") {
                bottomMargin = tm
            } else if (typeof tm === "string") {
                if (tm.indexOf("%") !== -1) {
                    bottomMargin = Number(tm.replace("%", "")) / 100
                } else if (
                    tm.indexOf("px") !== -1 &&
                    !Number.isNaN(tm.replace("px", ""))
                ) {
                    bottomMargin =
                        Number(tm.replace("px", "")) / window.innerHeight
                } else if (
                    tm.indexOf("rem") !== -1 &&
                    !Number.isNaN(tm.replace("rem", ""))
                ) {
                    bottomMargin =
                        (Number(tm.replace("rem", "")) * rootFontSize) /
                        window.innerHeight
                } else if (!Number.isNaN(tm)) {
                    bottomMargin = Number(tm)
                }
            }
        }

        if (bottomMargin + topMargin >= 1) {
            bottomMargin = 0
            topMargin = 0
        }
    } catch (e) {}

    useEffect(() => {
        const handleScroll = () => {
            let scrollTop = window.scrollY
            let docHeight = document.body.offsetHeight
            let winHeight = window.innerHeight
            let percentage = scrollTop / (docHeight - winHeight)
            pct.current = percentage

            let calculatedPercentage = Number(percentage)
            if (topMargin + bottomMargin !== 0) {
                calculatedPercentage =
                    (percentage - (0.5 - (bottomMargin - topMargin) / 2)) /
                        (1 - (topMargin + bottomMargin)) +
                    0.5
            }

            myAnime!.seek(myAnime!.duration * calculatedPercentage)
        }

        if (myAnime) window.addEventListener("scroll", handleScroll)

        return () => {
            if (myAnime) window.removeEventListener("scroll", handleScroll)
        }
    }, [myAnime])

    return [pct.current]
}

const scrollTop = window.pageYOffset || document.documentElement.scrollTop
const scrollHeight = document.documentElement.scrollHeight
const clientHeight = document.documentElement.clientHeight

const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

export { anime }
