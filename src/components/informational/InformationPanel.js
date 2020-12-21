import './InformationPanel.css'

export const InformationPanel = (props) => {
    return (
        <div className='panelroot'>
            <div className='informationsection'>
                { props.gameOver && !(props.darkResigned || props.lightResigned) && <h2 className='marginless'>{`${props.winner} wins`}</h2> }
                { !props.gameOver && props.lightInCheck &&
                    <h2 className='marginless'>Light in check</h2>
                }
                { !props.gameOver && props.darkInCheck &&
                    <h2 className='marginless'>Dark in check</h2>
                }
                { !props.gameOver && !props.darkInCheck && !props.lightInCheck &&
                    <h2 className='marginless'>Chess</h2>
                }
                { props.gameOver && props.lightResigned &&
                    <h2 className='marginless'>Light resigns</h2>
                }
                { props.gameOver && props.darkResigned &&
                    <h2 className='marginless'>Dark resigns</h2>
                }
                { props.lightDraw && props.darkDraw &&
                    <h2 className='marginless'>Draw</h2>
                }
            </div>
            <div className='movesection'>
                {props.moves.map((t, i) => (
                    <div className='moverow'>
                        <h2 className='moveelem'>{i + 1}.</h2>
                        { t[0] && <h2 className='movetxt moveelem'>{t[0]}</h2> }
                        { t[1] && <h2 className='movetxt moveelem'>{t[1]}</h2> }
                    </div>
                ))}
            </div>
            <div className='actionsection'>
                <div className='button' tabIndex='1' onClick={() => props.callback('again')}>
                    <h3 className='marginless'>play again</h3>
                </div>
                <div className='button' tabIndex='2' onClick={() => props.callback('back')}>
                    <h3 className='marginless'>step back</h3>
                </div>
                <div className='button' tabIndex='3' onClick={() => props.callback('forward')}>
                    <h3 className='marginless'>step forward</h3>
                </div>
            </div>
        </div>
    )
}

export default InformationPanel