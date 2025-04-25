import { Link, Route, Switch, Redirect } from 'wouter'

import TalaldKi from './components/TalaldKi'
import Jatek2048 from './components/Jatek2048'

import '../../feladat_1/style.css'
import './App.css'

function App() {
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
                                <li><a href="/" className="active" >React</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <section>
                    <div className="mw-container section">
                        <div className="content">
                            <div className="tabs">
                                <Link href="/talald-ki">Találd ki</Link>
                                <Link href="/2048">2048</Link>
                            </div>

                            <Switch>
                                <Route path="/">
                                    <Redirect to="/talald-ki" />
                                </Route>

                                <Route path="/talald-ki" component={TalaldKi} />

                                <Route path="/2048" component={Jatek2048} />

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
