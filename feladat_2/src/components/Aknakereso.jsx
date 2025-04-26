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
    let meret = 24
    let nehezseg = 3
    let aknak = 0
    const [palya, setPalya] = useState([[]])
    const [palyaUUID, setPalyaUUID] = useState('')
    const [palyaStatisztika, setPalyaStatisztika] = useState({ meret, aknak })

    function updatePalya(x, y, ertekek) {
        setPalya(palya.map((sor, sx) => sor.map((mezo, sy) => (sx === x && sy === y) ? Object.assign(mezo, ertekek) : mezo)))
    }

    function ujJatek() {
        let ujPalya = (Array(meret).fill().map(() => new Array(meret).fill({ ertek: null, felfedve: false})))
        //setPalya(epuloPalya)
        // Aknásítás
        aknak = Math.floor(Math.random() * ((meret * meret / (nehezseg * 2)) - (meret * meret / (nehezseg * 5))) + (meret * meret / (nehezseg * 5)))
        console.log(`${aknak} db akna generálása a ${meret * meret} méretű pályára, a(z) ${(meret * meret / (nehezseg * 5))} - ${(meret * meret / (nehezseg * 2))} nehézség alapján`)

        for (let i = 0; i < aknak; i++) {
            ujPalya[Math.floor(Math.random() * meret)][Math.floor(Math.random() * meret)] = { ertek: 'x', felfedve: false }
        }

        // Szomszédos aknák összeszámolása
        ujPalya = ujPalya.map((sor, x) => sor.map((mezo, y) => {
            if (mezo.ertek !== 'x') {
                let szomszedosAknak = 0
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if ((x + i < meret && y + j < meret && x + i >= 0 && y + j >= 0) && ujPalya[x + i][y + j].ertek === 'x') {
                            szomszedosAknak++
                        }
                    }
                }
                return { ertek: szomszedosAknak ? szomszedosAknak : null, felfedve: false }
            }
            return mezo
        }))

        setPalya(ujPalya)
        setPalyaUUID(crypto.randomUUID())
        setPalyaStatisztika({meret, aknak})
    }

    function handleUjJatek(esemeny) {
        // Új játék gomb esetén méretet állít
        esemeny.preventDefault()
        const form = new FormData(esemeny.target)
        meret = parseInt(form.get('selectedMeret'))
        nehezseg = parseInt(form.get('selectedNehezseg'))
        ujJatek()
    }

    function felfed(x, y) {
        /*if (palya[x][y].ertek !== 'x') {
            setPalya(palya.map((sor, sx) => sor.map((mezo, sy) => (sx === x && sy === y) ? Object.assign(mezo, { felfedve: true }) : mezo)))
        }*/
        const meret = palyaStatisztika.meret // ezen a ponton döntöttem el, hogy továbbra is jó lesz nekem a vue
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
                <p>Keresd meg a "szokásos" módon ebben a {palyaStatisztika.meret} x {palyaStatisztika.meret} = {palyaStatisztika.meret * palyaStatisztika.meret} méretű pályán mind a(z) {palyaStatisztika.aknak} db aknát. Jobb klikkel helyezhetők le a zászlók.</p>
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
                        <option value="8">XS (8x8)</option>
                        <option value="16">kicsi (16x16)</option>
                        <option value="24">közepes (24x24)</option>
                        <option value="32">nagy (32x32)</option>
                        <option value="48">XXL (48x48)</option>
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