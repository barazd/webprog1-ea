import React, { useState, useEffect } from 'react'
import Debug from './Debug'

function Mezo(props) {
    const [lathato, setLathato] = useState(props.felfedve)
    const [megjelelolt, setMegjelelolt] = useState(false)

    // Reseteljük a state-t, ha új kártyát húz a rendszer
    useEffect(() => {
        if (props.felfedve) {
            setLathato(true)
            setMegjelelolt(false)
        }
        else {
            setLathato(false)
            setMegjelelolt(false)
        }
    }, [props.felfedve])

    function handleClick(esemeny) {
        esemeny.preventDefault()
        // Bal klikk
        if (esemeny.type === 'click') {
            if (!lathato) {
                setMegjelelolt(false)
                setLathato(true)
                // Esemény kiküldése
                props.felfedes(props)
            }
        }
        // Jobb klikk
        else if (esemeny.type === 'contextmenu') {
            if (!lathato) setMegjelelolt(!megjelelolt)
        }
        
    }

    // Milyen ikont jelenítsen meg
    function getJelolo() {
        if (megjelelolt) {
            return '🚩'
        }
        else {
            return props.ertek === 'x' ? '💣' : props.ertek
        }
    }

    return (
        <>
            <div className={'field' + (lathato || megjelelolt ? ' show' + (props.ertek && !megjelelolt ? ' value-' + props.ertek : '') : ' hide')} onContextMenu={handleClick} onClick={handleClick}>
                <span>{getJelolo()}</span>
            </div>
        </>
    )
}

export default function Aknakereso() {
    const meret = 16
    const [palya, setPalya] = useState([[]])
    const [palyaUUID, setPalyaUUID] = useState('')

    function ujJatek() {
        let epuloPalya = new Array(meret).fill().map(() => new Array(meret).fill({ ertek: null, felfedve: false}))

        setPalyaUUID(crypto.randomUUID())
        // Aknásítás
        const mines = Math.floor(Math.random() * ((meret * meret / 6) - (meret * meret / 10)) + (meret * meret / 10))
        console.log(`${mines} db akna generálása`)

        for (let i = 0; i < mines; i++) {
            epuloPalya[Math.floor(Math.random() * meret)][Math.floor(Math.random() * meret)] = { ertek: 'x', felfedve: false }
        }

        // Szomszédos aknák összeszámolása
        epuloPalya = epuloPalya.map((sor, x) => sor.map((mezo, y) => {
            if (mezo.ertek !== 'x') {
                let szomszedosAknak = 0
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if ((x + i < meret && y + j < meret && x + i >= 0 && y + j >= 0) && epuloPalya[x + i][y + j].ertek === 'x') {
                            szomszedosAknak++
                        }
                    }
                }
                return { ertek: szomszedosAknak ? szomszedosAknak : null, felfedve: false }
            }
            return mezo
        }))

        setPalya(epuloPalya)
    }

    function felfed(x, y) {
        /*if (palya[x][y].ertek !== 'x') {
            setPalya(palya.map((sor, sx) => sor.map((mezo, sy) => (sx === x && sy === y) ? Object.assign(mezo, { felfedve: true }) : mezo)))
        }*/
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if ((x + i < meret && y + j < meret && x + i >= 0 && y + j >= 0) && palya[x + i][y + j].ertek !== 'x' && !palya[x + i][y + j].felfedve) {
                    // szomszéd felfedése
                    setPalya(palya.map((sor, sx) => sor.map((mezo, sy) => (sx === x + i && sy === y + j) ? Object.assign(mezo, { felfedve: true }) : mezo)))
                    // tovább megyünk, ha a szomszéd üres, egyébként elértük a határt
                    if (palya[x + i][y + j].ertek === null) {
                        felfed(x + i, y + j)
                    }
                }
            }
        }
    }

    function handleFelfedes(elem) {
        // felfedés követése
        setPalya(palya.map((sor, x) => sor.map((mezo, y) => (elem.x === x && elem.y === y) ? Object.assign(mezo, {felfedve: true}) : mezo)))

        // el kell dönteni mi történik
        console.log(elem)
        if (elem.ertek === 'x') {
            // Akna!
            console.log('Veszítettél')
            // Minden felfedése
            setPalya(palya.map((sor, x) => sor.map((mezo, y) => Object.assign(mezo, { felfedve: true }))))
        }
        else if (elem.ertek === null) {
            // El kell kezdeni felfedni az összes szomszédot
            console.log('felfedés')
            felfed(elem.x, elem.y)
        }
    }

    useEffect(() => {
        ujJatek()
    }, [])

    return (
        <>
            <div className="box">
                <h2>Aknekereső</h2>
                <p>Keresd meg a "szokásos" módon ebben a {meret} x {meret} méretű pályán az összes aknát. Jobb klikkel helyezhetők le a zászlók.</p>
                <div className="minefield">
                    {palya.map((sor, x) => {
                        return (<div key={x} className="row">
                            {sor.map((mezo, y) => {
                                return (<Mezo key={`${palyaUUID}-${x}-${y}`} ertek={mezo.ertek} felfedes={handleFelfedes} x={x} y={y} felfedve={mezo.felfedve} /> )
                            })}
                        </div>)
                    })}
                </div>
                <p><button onClick={ujJatek}>Új játék</button></p>
            </div>

            <Debug>
                    {palya.map((sor, x) => (
                        <p key = {`${x}`}><code>
                            {sor.map((mezo, y) => ` ${mezo.ertek === null ? '·' : mezo.ertek} `)}
                        </code>
                        </p>
                    ))}
            </Debug>
        </>
    )
}