import { useEffect, useState } from "react"
import './ChessBoard.css'


const getRounded = (rank, file) => {
    if (rank === 0 && file === 0) {
        return 'bottomleft'
    } else if (rank === 0 && file === 7) {
        return 'bottomright'
    } else if (rank === 7 && file === 0) {
        return 'topleft'
    } else if (rank === 7 && file === 7) {
        return 'topright'
    }

    return ''
}

export const BoardSquare = (props) => {
    
    return (
        <div className={getRounded(props.squareState.rank, props.squareState.file)}>
            <div className={`square square${props.squareState.color} active${props.active} available${props.available} ${getRounded(props.squareState.rank, props.squareState.file)}`} onClick={props.disableAction ? () => {} : () => props.callback(props.squareState)}>
                
                {props.squareState.piece.name !== 'empty' 
                    ? <img className={`square ${getRounded(props.squareState.rank, props.squareState.file)}`} src={`newpieces/${props.squareState.piece.color}${props.squareState.piece.name}.png`} />
                    : <span></span>
                }

                {props.available &&
                    <span className="dot"></span>
                }
            </div>
        </div>
    )
}

export const BoardRow = (props) => {
    return (
        <div className='row'>
            { props.row.map(s => <BoardSquare callback={props.callback} squareState={s} active={props.active?.rank === s.rank && props.active?.file === s.file} available={!!props.availableMoves?.find(m => m?.rank === s?.rank && m?.file === s?.file)} disableAction={props.disableAction}/>) }
        </div>
    )
}


export const ChessBoard = (props) => {
    const [revBoard, setRevBoard] = useState(props.boardState.slice(0).reverse())

    useEffect(() => {
        setRevBoard(props.boardState.slice(0).reverse())
    }, [props.boardState])

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div className='rankcol'>
                    {new Array(8).fill(0).map((r, i) => <h3 className='rankindicator'>{8 - i}</h3>)}
                </div>
                <div className='board'>
                    { revBoard
                        && revBoard.map((r, i) => <BoardRow key={i} callback={props.callback} row={r} active={props.activeSquare} availableMoves={props.availableMoves} disableAction={props.disableAction}/>) 
                    }
                </div>
            </div>
            <div className='row'>
                {['a','b','c','d','e','f','g','h'].map(f => <h3 className='fileindicator'>{f}</h3>)}
            </div>
        </div>
    )
}

export default ChessBoard