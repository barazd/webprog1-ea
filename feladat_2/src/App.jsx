import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../../feladat_1/style.css'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="wrapper">
                <header>
                    <div className="mw-container header">
                        <h1>Web-programozás-1 Előadás Házi feladat</h1>
                        <nav>
                            <ul>
                                <li><a href="/index.html" target="_blank" className="newpage">Kezdőlap</a></li>
                                <li><a href="/tablazat.html" target="_blank" className="newpage">Táblázat</a></li>
                                <li><a href="/html5.html" target="_blank" className="newpage">HTML5</a></li>
                                <li><a href="/chartjs.html" target="_blank" className="newpage">ChartJS</a></li>
                                <li><a href="/ajax.html" target="_blank" className="newpage">AJAX</a></li>
                                <li><a href="/oojs.html" target="_blank" className="newpage">OOJS</a></li>
                                <li><a href="/feladat_2/index.html" className="active" >React</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <section>
                    <div className="mw-container section">
                        <div className="content">
                            <div className="box">
                                <h2>React</h2>
                                <p>Kérem válasszon a menüpontok közül...</p>
                            </div>
                        </div>
                        <aside>
                            <div className="box">
                                <h2>Oldalsáv</h2>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus, amet optio deleniti aliquid laboriosam quas beatae quod quam libero repudiandae, dolor nihil quaerat, totam alias saepe numquam quidem? Voluptates, nostrum.</p>
                            </div>
                        </aside>
                    </div>
                </section>
                <footer>
                    <div className="mw-container footer">
                        <p><span className="by">Készette</span> Baráz Csongor Dömötör \ <code>BE4RVP</code></p>
                        <p>2025. 04. 21.</p>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default App
