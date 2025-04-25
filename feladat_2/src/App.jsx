import { Link, Route, Switch, Redirect, useLocation } from 'wouter'

import TalaldKi from './components/TalaldKi'
import Aknakereso from './components/Aknakereso'

import '../../feladat_1/style.css'
import './App.css'

function App() {
    const [location] = useLocation()

    return (
        <>
            <div className="wrapper">
                <header>
                    <div className="mw-container header">
                        <h1>Web-programozás-1 Előadás Házi feladat</h1>
                        <nav>
                            <ul>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/index.html" target="_blank" className="newpage">Kezdőlap</a></li>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/tablazat.html" target="_blank" className="newpage">Táblázat</a></li>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/html5.html" target="_blank" className="newpage">HTML5</a></li>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/chartjs.html" target="_blank" className="newpage">ChartJS</a></li>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/ajax.html" target="_blank" className="newpage">AJAX</a></li>
                                <li><a href="https://webprog1-ea-f1.baraz.hu/oojs.html" target="_blank" className="newpage">OOJS</a></li>
                                <li><a href="/" className="active" >React</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <section>
                    <div className="mw-container section">
                        <div className="content">
                            <div className="tabs">
                                <span><em>Válassz játékot &rarr;</em></span>
                                <Link href="/talald-ki" className={location === "/talald-ki" ? 'active' : ''}>Találd ki</Link>
                                <Link href="/aknakereso" className={location === "/aknakereso" ? 'active' : ''}>Aknakereső</Link>
                            </div>

                            <Switch>
                                <Route path="/">
                                    <Redirect to="/talald-ki" />
                                </Route>

                                <Route path="/talald-ki" component={TalaldKi} />

                                <Route path="/aknakereso" component={Aknakereso} />

                                /* Alapértelmezett útvonal */
                                <Route>
                                    <div className="box">
                                        <h2>404-es hiba</h2>
                                        <p>Az oldal nem található!</p>
                                    </div>
                                </Route>
                            </Switch>
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
