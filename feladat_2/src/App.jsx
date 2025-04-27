import { Link, Router, Route, Switch, Redirect, useLocation } from 'wouter'

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
                                <li><a href="/feladat_1/index.html" target="_blank" className="newpage">Kezdőlap</a></li>
                                <li><a href="/feladat_1/tablazat.html" target="_blank" className="newpage">Táblázat</a></li>
                                <li><a href="/feladat_1/html5.html" target="_blank" className="newpage">HTML5</a></li>
                                <li><a href="/feladat_1/chartjs.html" target="_blank" className="newpage">ChartJS</a></li>
                                <li><a href="/feladat_1/ajax.html" target="_blank" className="newpage">AJAX</a></li>
                                <li><a href="/feladat_1/oojs.html" target="_blank" className="newpage">OOJS</a></li>
                                <li><a href="/feladat_2" className="active" >React</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <section>
                    <div className="mw-container section">
                        <div className="content">
                            <div className="tabs">
                                <span><em>Válassz játékot &rarr;</em></span>
                                <Router base="/feladat_2">
                                    <Link href="/talald-ki" className={location === "/feladat_2/talald-ki" ? 'active' : ''}>Találd ki</Link>
                                    <Link href="/aknakereso" className={location === "/feladat_2/aknakereso" ? 'active' : ''}>Aknakereső</Link>
                                </Router>
                            </div>

                            <Router base="/feladat_2">
                                <Switch>
                                    <Route path="/">
                                        <Redirect to="/talald-ki" />
                                    </Route>

                                    <Route path="/talald-ki" component={TalaldKi} />

                                    <Route path="/aknakereso" component={Aknakereso} />

                                    <Route>
                                        <div className="box">
                                            <h2>404-es hiba</h2>
                                            <p>Az oldal nem található!</p>
                                        </div>
                                    </Route>
                                </Switch>
                            </Router>
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
