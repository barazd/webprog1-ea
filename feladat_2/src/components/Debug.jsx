import React, { useState } from 'react'

export default function Debug({ children }) {
    const [nyitva, setNyitva] = useState(false)

    return (
        <>

            <div className="box">
                <h2>Debug panel</h2>
                <p><em>Lenyitása csalásnak minősül!</em></p>
                <p><button onClick={() => setNyitva(!nyitva)}>{nyitva ? 'Bezár' : 'Lenyit'}</button></p>
                <div className={nyitva ? '' : 'hidden'}>
                    {children}
                </div>
            </div>
        </>
    )
}