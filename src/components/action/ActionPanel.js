import './ActionPanel.css'

const getFormatted = (time) => {
    return time > 9 ? `${time}` : `0${time}`
}

export const ActionPanel = (props) => {
    return (
        <div className='actionpanelroot'>
            <div className='dark actioncard'>
                <div className='actionrow'>
                    <h2 className='marginless'>dark</h2>
                    <div className={`button smallbutton ${props.darkDraw ? 'offeringdraw' : ''}`} tabIndex='1' onClick={() => props.callback('draw', 'dark')}>
                        <h3 className='marginless'>draw</h3>
                    </div>
                    <div className='button smallbutton' tabIndex='1' onClick={() => props.callback('resign', 'dark')}>
                        <h3 className='marginless'>resign</h3>
                    </div>
                </div>
                <div className='captured'>
                    {props.darkCaptured.map(p => <img className={`capturedpiece`} src={`newpieces/light${p}.png`} />)}
                </div>
            </div>

            <div className='xdark actioncard'>
                <div className='actionrow'>
                    <h2 className='marginless'>{`${props.lightScore} - ${props.darkScore}`}</h2>
                </div>

                <div className='actionrow'>
                    <div className='ltimeface'>
                        <h2 className='marginless'>{`${getFormatted(Math.floor(props.lightTime / 60))}:${getFormatted(props.lightTime % 60)}`}</h2>
                    </div>
                    <div className='dtimeface'>
                        <h2 className='marginless'>{`${getFormatted(Math.floor(props.darkTime / 60))}:${getFormatted(props.darkTime % 60)}`}</h2>
                    </div>
                </div>
            </div>

            <div className='light actioncard'>
                <div className='actionrow'>
                    <h2 className='marginless'>light</h2>
                    <div className={`lightbutton smallbutton ${props.lightDraw ? 'offeringdraw' : ''}`} tabIndex='1' onClick={() => props.callback('draw', 'light')}>
                        <h3 className='marginless'>draw</h3>
                    </div>
                    <div className='lightbutton smallbutton' tabIndex='1' onClick={() => props.callback('resign', 'light')}>
                        <h3 className='marginless'>resign</h3>
                    </div>
                </div>
                <div className='captured'>
                    {props.lightCaptured.map(p => <img className={`capturedpiece`} src={`newpieces/dark${p}.png`} />)}
                </div>
            </div>
        </div>
    )
}

export default ActionPanel