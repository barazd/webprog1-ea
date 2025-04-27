import React, { useState, useEffect } from 'react'
import Debug from './Debug'

function Kartya(props) {
    const [selected, setSelected] = useState(false)

    // Reseteljük a state-t, ha új kártyát húz a rendszer
    useEffect(() => {
        setSelected(false)
    }, [props.kartya])

    function huzas() {
        // Ha már fel volt húzva, nem csinál semmit...
        if (!selected) {
            setSelected(true)
            props.felhuzva(props.nyertes) // Ez elvileg olyan, mint az emit
        }
    }

    return (
        <>
            <div className={'card' + (selected ? ' selected' + (props.nyertes ? ' winner' : ' wrong') : '')} onClick={huzas}>
                <div>{props.kartya}</div>
                <div>{props.kartya}</div>
            </div>
        </>
    )
}

export default function TalaldKi() {
    const kartyakSzama = 6
    const [kartyak, setKartyak] = useState([])
    const [valasztott, setValasztott] = useState(0)
    const [uzenetek, setUzenetek] = useState([])
    const [probalkozasok, setProbalkozasok] = useState(0)

    const szinek = ['♣️', '♠️', '♥️', '♦️'] // remélem működik az emoji
    const szamok = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']

    function ujJatek() {
        console.log("Új játék kezdése...")
        // Kiürítjük a húzott kártyákat stb
        setKartyak([])
        setProbalkozasok(0)
        setUzenetek([])

        // Kártyákat húzunk
        let i = 0
        while (i < kartyakSzama) {
            let kartya = `${szinek[Math.floor(Math.random() * szinek.length)]}${szamok[Math.floor(Math.random() * szamok.length)]}`
            if (!kartyak.includes(kartya)) {
                setKartyak(prevState => [...prevState, kartya])
                i++
            }
        }

        // Kiválasztjuk a kártyát
        setValasztott(Math.floor(Math.random() * kartyak.length))
    }

    function handleHuzas(eredmeny) {
        if (!uzenetek.some(uzenet => uzenet.eredmeny)) {
            if (eredmeny) {
                if (probalkozasok === 0) {
                    setUzenetek(prevState => [...prevState, { eredmeny, uzenet: `Váó, elsőre eltaláltad a kártyát!` }])
                }
                else {
                    setUzenetek(prevState => [...prevState, { eredmeny, uzenet: `Gratulálok, ${probalkozasok + 1}. próbálkozásra eltaláltad a kártyát!` }])
                }
            }
            else {
                setUzenetek(prevState => [...prevState, { eredmeny, uzenet: `Sajnos nem sikerült... ${probalkozasok === 0 ? `De ne csüggedj, segítek: ${kartyak[valasztott].startsWith('♣️') || kartyak[valasztott].startsWith('♠️') ? 'feketét' : 'pirosat'} választottam!` : (probalkozasok === 1 ? `Még egy kis segítség: ${Number.isNaN(parseInt(kartyak[valasztott].charAt(kartyak[valasztott].length - 1))) ? 'betűs' : 'számos'} kártyát választottam.` : `Többet nem segítek, már csak ${kartyakSzama - probalkozasok - 1} kártya van hátra.`)}` }])
                setProbalkozasok(probalkozasok + 1)
            }
        }
    }

    // Ez elvileg olyan, mint az onMounted
    useEffect(() => {
        console.log('auto húzás')
        ujJatek()
    }, [])

    return (
        <>
            <div className="box">
                <h2>Találd ki!</h2>
                <p>Húztam {kartyakSzama} kártyát, találd ki melyiket választottam!</p>
                <div className="draw">
                    {kartyak.map((kartya, i) => {
                        return (<Kartya key={i} kartya={kartya} nyertes={i === valasztott} felhuzva={handleHuzas} />)
                    })}
                </div>
                <ul className="messages">
                    {uzenetek.map((uzenet, i) => {
                        return (<li key={i} className={uzenet.eredmeny ? 'win' : 'wrong'}>{uzenet.uzenet}</li>)
                    })}
                </ul>
                <p><button onClick={ujJatek}>Új játék!</button></p>
            </div>

            <Debug>
                <ul>
                    <li><code>kartyakSzama = {kartyakSzama}</code></li>
                    <li><code>kartyak = {kartyak.map((kartya, i) => (`${i}: ${kartya}, `))}</code></li>
                    <li><code>valasztott = {valasztott}: {kartyak[valasztott]}</code></li>
                    <li><code>probalkozasok = {probalkozasok}</code></li>
                </ul>
            </Debug>
        </>
    )
}