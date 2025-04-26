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
    const [meret, setMeret] = useState(24)
    const [nehezseg, setNehezseg] = useState(3)
    const [palya, setPalya] = useState([[]])
    const [palyaUUID, setPalyaUUID] = useState('')
    const [aknak, setAknak] = useState(0)

    function ujJatek() {
        let epuloPalya = new Array(meret).fill().map(() => new Array(meret).fill({ ertek: null, felfedve: false}))
        //setPalya(epuloPalya)
        // Aknásítás
        setAknak(Math.floor(Math.random() * ((meret * meret / (nehezseg * 2)) - (meret * meret / (nehezseg * 5))) + (meret * meret / (nehezseg * 5))))
        console.log(`${aknak} db akna generálása a ${meret} méretű pályára`)

        for (let i = 0; i < aknak; i++) {
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
        setPalyaUUID(crypto.randomUUID())
    }

    function handleUjJatek(esemeny) {
        // Új játék gomb esetén méretet állít
        esemeny.preventDefault()
        const form = new FormData(esemeny.target)
        setMeret(parseInt(form.get('selectedMeret')))
        setNehezseg(parseInt(form.get('selectedNehezseg')))
        //setPalya([])
        ujJatek()
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
                <p>Keresd meg a "szokásos" módon ebben a {meret} x {meret} = {meret * meret} méretű pályán mind a(z) {aknak} db aknát. Jobb klikkel helyezhetők le a zászlók.</p>
                <div className="minefield">
                    {palya.map((sor, x) => {
                        return (<div key={x} className="row">
                            {sor.map((mezo, y) => {
                                return (<Mezo key={`${palyaUUID}-${x}-${y}`} ertek={mezo.ertek} felfedes={handleFelfedes} x={x} y={y} felfedve={mezo.felfedve} /> )
                            })}
                        </div>)
                    })}
                </div>
                <form onSubmit={handleUjJatek}>
                    Méret: 
                    <select name="selectedMeret" defaultValue={meret}>
                        <option value="8">XS teszteléshez</option>
                        <option value="16">kicsi</option>
                        <option value="24">közepes</option>
                        <option value="32">nagy</option>
                        <option value="48">XXL</option>
                    </select>

                    Nehézség:
                    <select name="selectedNehezseg" defaultValue={nehezseg}>
                        <option value="5">könnyű</option>
                        <option value="3">közepes</option>
                        <option value="1">nehéz</option>
                    </select>
                     
                    <button type='submit'>Új játék</button>
                </form>
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