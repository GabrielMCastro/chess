import React, { useState, useEffect}from "react"

import ChessBoard from "./components/chessboard/ChessBoard"
import InformationPanel from "./components/informational/InformationPanel"
import ActionPanel from "./components/action/ActionPanel"

export class Root extends React.Component {

    squareColorFromRankAndFile(rank, file) {
        return (rank % 2) === 0 
                ? (file % 2) === 0 
                    ? 'dark' 
                    : 'light'
                : (file % 2) === 0
                    ? 'light'
                    : 'dark'
    }

    getPawnPromotionSquare(color, rank, file) {
        var spot = {}

        if (rank === 3 && file === 3) {
            spot = {
                piece: {
                    name: 'rook',
                    color: color,
                    beenMoved: false,
                },
                rank: rank,
                file: file,
                color: this.squareColorFromRankAndFile(rank, file),
            }
        }else if (rank === 4 && file === 3) {
        spot = {
            piece: {
                name: 'bishop',
                color: color,
                beenMoved: false,
            },
            rank: rank,
            file: file,
            color: this.squareColorFromRankAndFile(rank, file),
        }
    }else if (rank === 4 && file === 4) {
        spot = {
            piece: {
                name: 'queen',
                color: color,
                beenMoved: false,
            },
            rank: rank,
            file: file,
            color: this.squareColorFromRankAndFile(rank, file),
        }
    } else if (rank === 3 && file === 4) {
        spot = {
            piece: {
                name: 'knight',
                color: color,
                beenMoved: false,
            },
            rank: rank,
            file: file,
            color: this.squareColorFromRankAndFile(rank, file),
        }
    } else {
        spot = {
            piece: {
                name: 'empty',
                color: 'empty',
                beenMoved: false,
            },
            rank: rank,
            file: file,
            color: this.squareColorFromRankAndFile(rank, file),
        }
    }

        return spot
    }

    getPawnPromotionBoard(color) {
        var board = [0,1,2,3,4,5,6,7]
        board = board.map(() => [0,1,2,3,4,5,6,7])

        board = board.map((r, i) => r.map((f, e) => this.getPawnPromotionSquare(color, i, e)))

        return board
    }

    getPieceFromFile(file) {
        switch (file) {
            case 0:
                return 'rook'
            case 1:
                return 'knight'
            case 2:
                return 'bishop'
            case 3:
                return 'queen'
            case 4:
                return 'king'
            case 5:
                return 'bishop'
            case 6:
                return 'knight'
            case 7:
                return 'rook'
        }
    }
    
    generateRow(pawns, color, rank) {
        var row = new Array(8)
        row.fill({})

        if(color === 'empty') {
            row = row.map((e, i) => {
                return {
                    piece: {
                        name: 'empty',
                        color: 'empty',
                    },
                    rank: rank,
                    file: i,
                    color: this.squareColorFromRankAndFile(rank, i),
                }
            })
        } else if (color === 'light') {
            row = row.map((e, i) => {
                return {
                    piece: {
                        name: pawns ? 'pawn' : this.getPieceFromFile(i),
                        color: 'light',
                        beenMoved: false,
                    },
                    rank: rank,
                    file: i,
                    color: this.squareColorFromRankAndFile(rank, i),
                }
            })
        } else if (color === 'dark') {
            row = row.map((e, i) => {
                return {
                    piece: {
                        name: pawns ? 'pawn' : this.getPieceFromFile(i),
                        color: 'dark',
                        beenMoved: false,
                    },
                    rank: rank,
                    file: i,
                    color: this.squareColorFromRankAndFile(rank, i),
                }
            })
        }

        return row
    }

    generateNewGame() {
        var board = new Array(8);
            board.fill({})

            board = board.map((val, i) => {
                switch (i) {
                    case 0: // Rank 1
                        var row = this.generateRow(false, 'light', i)

                        return row
                    case 1: // Rank 2
                        var row = this.generateRow(true, 'light', i)

                        return row
                    case 6: // Rank 7
                        var row = this.generateRow(true, 'dark', i)

                        return row
                    case 7: // Rank 8
                        var row = this.generateRow(false, 'dark', i)

                        return row
                    default:
                        return this.generateRow(false, 'empty', i)
                }
            })

            return {
                boardState: board,
                turn: 'light',
                gameOver: false,
                winner: '',
                activeSquare: undefined,
                availableMoves: [],
                lightKing: {
                        piece: {
                        name: 'king',
                        color: 'light',
                        beenMoved: false,
                    },
                    rank: 0,
                    file: 4,
                    color: 'dark',
                },
                darkKing: {
                        piece: {
                        name: 'king',
                        color: 'dark',
                        beenMoved: false,
                    },
                    rank: 7,
                    file: 4,
                    color: 'light',
                },
                darkInCheck: false,
                lightInCheck: false,
                movesMade: [],
                boardStateHistory: [board],
                rewind: 0,
                pawnPromotionState: false,
                pawnToBePromoted: {},
                darkCaptured: [],
                lightCaptured: [],
                lightResigned: false,
                darkResigned: false,
                darkOfferingDraw: false,
                lightOfferingDraw: false,
                lightTime: (60 * 45),
                darkTime: (60 * 45),
                screenWidth: this.state?.screenWidth ?? 0,
                screenHeight: this.state?.screenWidth ?? 0,
                lightEnPassant: {},
                darkEnPassant: {},
            }
    }

    constructor(props) {
        super(props);

        this.state = this.generateNewGame()
        this.timer = 0
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
    }

    recurseAvailable(rank, file, color, board, rankOrFile, direction, open) {
        if (rankOrFile === 'rank') {
            var loc = board?.[rank + direction]?.[file]

            if (!!loc) {
                if(loc.piece.color === 'empty') {
                    return this.recurseAvailable(rank + direction, file, color, board, rankOrFile, direction, open.slice(0).concat([loc]))
                } else if(loc.piece.color != color) {
                    return open.slice(0).concat([loc])
                }
            }

            return open.slice(0)
        } else {
            var loc = board?.[rank]?.[file + direction]

            if (!!loc) {
                if(loc.piece.color === 'empty') {
                    return this.recurseAvailable(rank, file + direction, color, board, rankOrFile, direction, open.slice(0).concat([loc]))
                } else if(loc.piece.color != color) {
                    return open.slice(0).concat([loc])
                }
            }

            return open.slice(0)
        }
    }

    recurseAvailableDiagonal(rank, file, color, board, dX, dY, open) {
        var loc = board?.[rank + dY]?.[file + dX]

        if (!!loc) {
            if(loc.piece.color === 'empty') {
                return this.recurseAvailableDiagonal(rank + dY, file + dX, color, board, dX, dY, open.slice(0).concat([loc]))
            } else if(loc.piece.color != color) {
                return open.slice(0).concat([loc])
            }
        }

        return open.slice(0)
    }

    beingAttacked(piece, board) {
        
        if (!!piece) {
            var r = piece.rank
            var f = piece.file
            var opp = piece.piece.color === 'light' ? 'dark' : 'light'

            var diagonals = []
            diagonals.push(this.recurseAvailableDiagonal(r, f, piece.piece.color, board, 1, 1, []))
            diagonals.push(this.recurseAvailableDiagonal(r, f, piece.piece.color, board, 1, -1, []))
            diagonals.push(this.recurseAvailableDiagonal(r, f, piece.piece.color, board, -1, 1, []))
            diagonals.push(this.recurseAvailableDiagonal(r, f, piece.piece.color, board, -1, -1, []))
            diagonals = diagonals.filter(move => !!move.find(p => ((p?.piece.name === 'queen' || p?.piece.name === 'bishop') && p?.piece.color === opp)))
            diagonals = [].concat(...diagonals)

            var rooks = []
            rooks.push(this.recurseAvailable(r, f, piece.piece.color, board, 'rank', 1, []))
            rooks.push(this.recurseAvailable(r, f, piece.piece.color, board, 'rank', -1, []))
            rooks.push(this.recurseAvailable(r, f, piece.piece.color, board, 'file', 1, []))
            rooks.push(this.recurseAvailable(r, f, piece.piece.color, board, 'file', -1, []))
            rooks = rooks.filter(move => !!move.find(p => ((p?.piece.name === 'queen' || p?.piece.name === 'rook') && p?.piece.color === opp)))
            rooks = [].concat(...rooks)

            var knights = [].concat([ board?.[r + 2]?.[f - 1], board?.[r + 2]?.[f + 1] ])
            .concat([ board?.[r - 2]?.[f - 1], board?.[r - 2]?.[f + 1] ])
            .concat([ board?.[r + 1]?.[f - 2], board?.[r - 1]?.[f - 2] ])
            .concat([ board?.[r + 1]?.[f + 2], board?.[r - 1]?.[f + 2] ])
            knights = knights.filter(p => p?.piece.name === 'knight' && p?.piece.color === opp)

            var dF = piece.piece.color === 'light' ? 1 : -1
            var pawns = [ board?.[r + dF]?.[f - 1], board?.[r + dF]?.[f + 1] ]
            pawns = pawns.filter(p => p?.piece.name === 'pawn' && p?.piece.color === opp)

            var king = [].concat([ board?.[r + 1]?.[f - 1], board?.[r + 1]?.[f], board?.[r + 1]?.[f + 1] ])
            .concat([ board?.[r]?.[f - 1], board?.[r]?.[f + 1] ])
            .concat([ board?.[r - 1]?.[f - 1], board?.[r - 1]?.[f], board?.[r - 1]?.[f - 1] ])
            king = king.filter(p => p?.piece.name === 'king' && p?.piece.color === opp)

            var a = diagonals.length > 0 || rooks.length > 0 || knights.length > 0 || pawns.length > 0 || king.length > 0
            var spots = diagonals.slice(0).concat(rooks.slice(0)).concat(knights.slice(0)).concat(pawns.slice(0)).concat(king.slice(0))

            return { attacked: a, attackingSpots: spots}
        }

        return { attacked: false, attackedSpots: []}
    }

    getPawnAvailable(active, board) {
        var open = []
        var r = active.rank
        var f = active.file
        var opp = active.piece.color === 'light' ? 'dark' : 'light'

        if (active.piece.color === 'light') {
            open.push(board[r + 1]?.find(v => v.file === f && v.piece.name === 'empty'))

            if (!active.piece.beenMoved && !!open[0]) {
                open.push(board[r + 2]?.find(v => v.file === f && v.piece.name === 'empty'))
            }

            open.push(board[r + 1]?.find(v => v.file === (f - 1) && v.piece.color === opp))
            open.push(board[r + 1]?.find(v => v.file === (f + 1) && v.piece.color === opp))

        } else {
            open.push(board[r - 1]?.find(v => v.file === f && v.piece.name === 'empty'))

            if (!active.piece.beenMoved && !!open[0]) {
                open.push(board[r - 2]?.find(v => v.file === f && v.piece.name === 'empty'))
            }

            open.push(board[r - 1]?.find(v => v.file === (f - 1) && v.piece.color === opp))
            open.push(board[r - 1]?.find(v => v.file === (f + 1) && v.piece.color === opp))
        }

        if (active.piece.color === 'light') {
            if (this.state.darkEnPassant.rank === r + 1 && ((this.state.darkEnPassant.file === f - 1) ||(this.state.darkEnPassant.file === f + 1))) {
                open.push(board[this.state.darkEnPassant.rank][this.state.darkEnPassant.file])
            }
        } else if (active.piece.color === 'dark') {
            if (this.state.lightEnPassant.rank === r - 1 && ((this.state.lightEnPassant.file === f - 1) ||(this.state.lightEnPassant.file === f + 1))) {
                open.push(board[this.state.lightEnPassant.rank][this.state.lightEnPassant.file])
            }
        }

        return open
    }

    getRookAvailable(active, board) {
        var open = []

        open = open.concat(this.recurseAvailable(active.rank, active.file, active.piece.color, board, 'rank', 1, []))
        open = open.concat(this.recurseAvailable(active.rank, active.file, active.piece.color, board, 'rank', -1, []))
        open = open.concat(this.recurseAvailable(active.rank, active.file, active.piece.color, board, 'file', 1, []))
        open = open.concat(this.recurseAvailable(active.rank, active.file, active.piece.color, board, 'file', -1, []))

        return open
}

    getKnightAvailable(active, board) {
        var r = active.rank
        var f = active.file
        var open = []

        open = [].concat([ board?.[r + 2]?.[f - 1], board?.[r + 2]?.[f + 1] ])
                .concat([ board?.[r - 2]?.[f - 1], board?.[r - 2]?.[f + 1] ])
                .concat([ board?.[r + 1]?.[f - 2], board?.[r - 1]?.[f - 2] ])
                .concat([ board?.[r + 1]?.[f + 2], board?.[r - 1]?.[f + 2] ])
        
        open = open.slice(0).filter(s => s?.piece.color !== active?.piece.color)

        return open
    }

    getBishopAvailable(active, board) {
        var open = []

        open = open.concat(this.recurseAvailableDiagonal(active.rank, active.file, active.piece.color, board, 1, 1, []))
        open = open.concat(this.recurseAvailableDiagonal(active.rank, active.file, active.piece.color, board, 1, -1, []))
        open = open.concat(this.recurseAvailableDiagonal(active.rank, active.file, active.piece.color, board, -1, 1, []))
        open = open.concat(this.recurseAvailableDiagonal(active.rank, active.file, active.piece.color, board, -1, -1, []))
            
        return open
    }

    getQueenAvailable(active, board) {
        var open = []

        open = open.concat(this.getRookAvailable(active, board))
        open = open.concat(this.getBishopAvailable(active, board))

        return open
    }

    getKingAvailable(piece, board) {
        var active = { ...piece }
        var r = active.rank
        var f = active.file
        var open = [].concat([ board?.[r + 1]?.[f - 1], board?.[r + 1]?.[f], board?.[r + 1]?.[f + 1] ])
                 .concat([ board?.[r]?.[f - 1], board?.[r]?.[f + 1] ])
                 .concat([ board?.[r - 1]?.[f - 1], board?.[r - 1]?.[f], board?.[r - 1]?.[f + 1] ])

        open = open.filter(s => s?.piece.color !== active?.piece.color)

        var checkBoard = board.slice(0).map(r => r.slice(0))
        checkBoard[r][f] = {
            ...checkBoard[r][f],
            piece: {
                name: 'empty',
                color: 'empty',
                beenMoved: undefined
            }
        }

        var kingside = board?.[r]?.filter(s => {
            return s.file > 4 && (s.piece.name === 'rook' || s.piece.name === 'empty') && !!!s.piece.beenMoved && !this.beingAttacked({ ...s, piece: { ...active.piece } }, board).attacked
        })

        var canKingsideCastle = kingside.length === 3 && !active.piece.beenMoved
        open = canKingsideCastle ? open.concat([{ ...board?.[r]?.[7]}]) : open

        var queenside =  board?.[r]?.filter(s => {
            return s.file < 4 && (s.piece.name === 'rook' || s.piece.name === 'empty') && !!!s.piece.beenMoved && !this.beingAttacked({ ...s, piece: { ...active.piece } }, board).attacked
        })
        var canQueensideCastle = queenside.length === 4 && !active.piece.beenMoved
        open = canQueensideCastle ? open.concat([{ ...board?.[r]?.[0]}]) : open

        open = open.filter(s => !this.beingAttacked({ ...s, piece: {...piece.piece} }, checkBoard).attacked)

        return open
    }

    getAvailableMoves(active, board) {
        var checkBoard = board.slice(0).map(r => r.slice(0))
        var r = active?.rank
        var f = active?.file

        checkBoard[r][f] = {
            ...checkBoard[r][f],
            piece: {
                name: 'empty',
                color: 'empty',
                beenMoved: undefined
            }
        }

        var king = active?.piece.color === 'light' ? this.state.lightKing : this.state.darkKing

        var availableMoves = []

        switch (active.piece.name) {
            case 'pawn':
                availableMoves = this.getPawnAvailable(active, board)
                break
            case 'rook':
                availableMoves = this.getRookAvailable(active, board)
                break
            case 'knight':
                availableMoves = this.getKnightAvailable(active, board)
                break
            case 'bishop':
                availableMoves = this.getBishopAvailable(active, board)
                break
            case 'queen':
                availableMoves = this.getQueenAvailable(active, board)
                break
            case 'king':
                availableMoves = this.getKingAvailable(active, board)
                break
            default:
                break
        }

        if (active.piece.name !== 'king') {

            availableMoves = availableMoves.filter(m => { // Checking whether the move puts your king into check
                if (!!m) {
                    var b = checkBoard.slice(0).map(r => r.slice(0))

                    b[m.rank][m.file] = {
                        ...b[m.rank][m.file],
                        piece: {
                            ...active.piece
                        }
                    }

                    var att = this.beingAttacked(king, b)

                    return !att.attacked
                }
                return false
            })
        }

        return availableMoves
    }

    getFileLetter(file) {
        switch (file) {
            case 0:
                return 'a'
            case 1:
                return 'b'
            case 2:
                return 'c'
            case 3:
                return 'd'
            case 4:
                return 'e'
            case 5:
                return 'f'
            case 6:
                return 'g'
            case 7:
                return 'h'
            default:
                return 'X'
        }
    }

    getLetter(piece) {
        switch (piece) {
            case 'rook':
                return 'R'
            case 'knight':
                return 'N'
            case 'bishop':
                return 'B'
            case 'queen':
                return 'Q'
            case 'king':
                return 'K'
            default:
                return ''
        }
    }

    getAlgebraic(from, to) {
        var a = `${this.getLetter(from.piece.name)}${this.getFileLetter(from.file)}${from.rank + 1}`
        var cap = to.piece.name !== 'empty' ? 'x' : ''
        var b = `${this.getFileLetter(to.file)}${to.rank + 1}`

        return `${a}${cap}${b}`
    }

    move(from, to, board, castling, movesMade, boardStateHistory, pawnToBePromoted, lightCaptured, darkCaptured) {
        var newB = board.slice(0)?.map(m => m?.slice(0))
        var turn = this.state.turn
        var lk = this.state.lightKing
        var dk = this.state.darkKing
        var momade = movesMade.slice(0)?.map(m => m?.slice(0))
        var moveMade = this.getAlgebraic(from, to)
        var rewind = this.state.rewind
        var pawnPromotionState = this.state.pawnPromotionState
        var bsh = boardStateHistory?.slice(0).map(m => m?.slice(0).map(r => r?.slice(0)))
        var pawnPro = { ...pawnToBePromoted }
        var dEP = { ...this.state.darkEnPassant }
        var lEP = { ...this.state.lightEnPassant }
        
        var lc = lightCaptured?.slice(0) ?? this.state.lightCaptured
        var dc = darkCaptured?.slice(0) ?? this.state.darkCaptured

        if (!!!castling) {   
            if (momade.length > 0) {
                var move = momade[momade.length - 1]

                if(move.length === 1) {
                    move.push(moveMade)
                    momade[momade.length - 1] = move
                } else {
                    momade.push([moveMade])
                }
            } else {
                momade.push([moveMade])
            }
        } else {
            if (castling === 'kingside') {
                var move = momade[momade.length - 1]

                if(move.length === 1) {
                    move.push('O-O')
                    momade[momade.length - 1] = move
                } else {
                    momade.push(['O-O'])
                }
            } else if (castling === 'queenside') {
                var move = momade[momade.length - 1]
                
                if(move.length == 1) {
                    move.push('O-O-O')
                    momade[momade.length - 1] = move
                } else {
                    momade.push(['O-O-O'])
                }
            }
        }

        newB[to.rank][to.file] = {
            ...to,
            piece: {
                ...from.piece,
                beenMoved: true
            }
        }

        newB[from.rank][from.file] = {
            ...from,
            piece: {
                name: 'empty',
                color: 'empty',
                beenMoved: undefined,
            }
        }

        if (to.piece.color !== from.piece.color) {
            if (to.piece.color === 'light') {

                dc.push(to.piece.name)

            } else if (to.piece.color === 'dark') {

                lc.push(to.piece.name)

            }
        }

        if (from.piece.name === 'king') {
            if(turn === 'light') {
                lk = newB[to.rank][to.file]
            } else if (turn === 'dark') {
                dk = newB[to.rank][to.file]
            }
        }

        if (from.piece.name === 'pawn') {
            var promotionRank = from.piece.color === 'light' ? 7 : 0

            if (to.rank === promotionRank) {
                pawnPromotionState = true;
                newB = this.getPawnPromotionBoard(this.state.turn)
                pawnPro = newB[to.rank][to.file]
            }
        }

        var ep = Math.abs(to.rank - from.rank) === 2 && from.piece.name === 'pawn'

        if (from.piece.color === 'light') {
            if (ep) {
                lEP = {
                    rank: from.rank + 1,
                    file: from.file,
                }
            } else {
                lEP = {}
            }

            if (to.rank === dEP.rank && to.file === dEP.file) {
                newB[dEP.rank - 1][dEP.file] = {
                    ...newB[dEP.rank - 1][dEP.file],
                    piece: {
                        name: 'empty',
                        color: 'empty',
                        beenMoved: undefined,
                    }
                }

                lc.push('pawn')
            }
        } else if (from.piece.color === 'dark') {
            if (ep) {
                dEP = {
                    rank: from.rank - 1,
                    file: from.file,
                }
            } else {
                dEP = {}
            }

            if (to.rank === lEP.rank && to.file === lEP.file) {
                newB[lEP.rank + 1][lEP.file] = {
                    ...newB[lEP.rank + 1][lEP.file],
                    piece: {
                        name: 'empty',
                        color: 'empty',
                        beenMoved: undefined,
                    }
                }

                dc.push('pawn')
            }
        }

        var lightCheck = false
        var darkCheck = false

        if (!pawnPromotionState) {
            lightCheck = this.beingAttacked(lk, newB)
            darkCheck = this.beingAttacked(dk, newB)
        }

        bsh = bsh.slice(rewind)
        rewind = 0


        bsh.unshift(newB.slice(0).map(m => m.slice(0)))

        if (to.piece.name !== 'empty') {
            var moveA = new Audio('/sounds/reg_move_1.mp3')
            moveA.playbackRate = 2
            moveA.volume = .3
            moveA.play()
        } else {
            var moveA = new Audio('/sounds/slide_move.mp3')
            moveA.playbackRate = 2
            moveA.volume = .8
            moveA.play()
        }

        this.endTimer()
        this.startTimer(from.piece.color === 'light' ? 'dark' : 'light')

        
        return { 
            upB: newB, 
            darkInCheck: darkCheck.attacked, 
            lightInCheck: lightCheck.attacked,
            lightKing: lk, 
            darkKing: dk,
            movesMade: momade,
            rewind: rewind,
            boardStateHistory: bsh,
            pawnPromotionState: pawnPromotionState,
            pawnToBePromoted: pawnPro,
            lightCaptured: lc,
            darkCaptured: dc,
            lightEnPassant: lEP,
            darkEnPassant: dEP,
        }
    }

    checkmated(king, board) {
        var b = board.slice(0).map(r => r.slice(0))

        var moveAvailable = b.reduce((acc, curr) => {
            var n = curr.reduce((a, c) => {
                var m
                if (king.piece.color === c.piece.color) {
                    var v = this.getAvailableMoves(c, board).filter(el => !!el)

                    m = v.length > 0
                }

                return a || m
            }, false)

            return acc || n
        }, false)

        return !moveAvailable
    }

    setActiveSquare(trigger) {

        var upB = this.state.boardState
        var turn = this.state.turn
        var lightK = this.state.lightKing
        var darkK = this.state.darkKing
        var darkInCheck = this.state.darkInCheck
        var lightInCheck = this.state.lightInCheck
        var gameOver = this.state.gameOver
        var winner = this.state.winner
        var movesMade = this.state.movesMade
        var boardStateHistory = this.state.boardStateHistory
        var pawnPromotionState = this.state.pawnPromotionState
        var pawnToBePromoted = this.state.pawnToBePromoted
        var rewind = this.state.rewind
        var lightCaptured = this.state.lightCaptured
        var darkCaptured = this.state.darkCaptured
        var lightScore = this.state.lightScore ?? 0
        var darkScore = this.state.darkScore ?? 0
        var availableMoves;
        var lEP = this.state.lightEnPassant
        var dEP = this.state.darkEnPassant



        if (trigger !== this.state.activeSquare) {
            if (pawnPromotionState) {
                upB = boardStateHistory.slice(0).map(m => m.slice(0).map(v => v.slice(0)))[1]
                var dy = turn === 'light' ?  1 : -1

                upB[pawnToBePromoted?.rank][pawnToBePromoted?.file] = {
                    ...pawnToBePromoted,
                    piece: {
                        ...trigger.piece
                    }
                }
                upB[pawnToBePromoted?.rank + dy][pawnToBePromoted?.file] = {
                    ...upB[pawnToBePromoted?.rank + dy][pawnToBePromoted?.file],
                    piece: {
                        name: 'empty',
                        color: 'empty',
                        beenMoved: false
                    }
                }

                pawnPromotionState = false

            } else {
                if (this.state.turn === trigger.piece.color) {
                    if (!!this.state.availableMoves && !!this.state.availableMoves.find(m => m?.rank === trigger?.rank && m?.file === trigger?.file && m?.piece === trigger?.piece)) {
                        // Castling
                        if (trigger.file === 7) { // Kingside
                            var rookM = this.move(trigger, this.state.boardState?.[trigger.rank]?.[5], this.state.boardState, 'rook', movesMade, boardStateHistory, lightCaptured, darkCaptured)
                            var kingM = this.move(this.state.activeSquare, rookM.upB?.[trigger.rank]?.[6], rookM.upB, 'kingside', movesMade, boardStateHistory, lightCaptured, darkCaptured)
                            
                            upB = kingM.upB
                            lightK = kingM.lightKing
                            darkK = kingM.darkKing
                            movesMade = kingM.movesMade
                            boardStateHistory = kingM.boardStateHistory
                            rewind = kingM.rewind
                            pawnPromotionState = kingM.pawnPromotionState
                            lEP = kingM.lightEnPassant
                            dEP = kingM.darkEnPassant

                        } else if (trigger.file === 0) { // Queenside
                            var rookM = this.move(trigger, this.state.boardState?.[trigger.rank]?.[3], this.state.boardState, 'rook', movesMade, boardStateHistory, lightCaptured, darkCaptured)
                            var kingM = this.move(this.state.activeSquare, rookM.upB?.[trigger.rank]?.[2], rookM.upB, 'queenside', movesMade, boardStateHistory, lightCaptured, darkCaptured)
                            
                            upB = kingM.upB
                            lightK = kingM.lightKing
                            darkK = kingM.darkKing
                            movesMade = kingM.movesMade
                            boardStateHistory = kingM.boardStateHistory
                            rewind = kingM.rewind
                            pawnPromotionState = kingM.pawnPromotionState
                            lEP = kingM.lightEnPassant
                            dEP = kingM.darkEnPassant
                        }

                        turn = turn === 'light' ? 'dark' : 'light'
                        availableMoves = undefined
                        
                    } else {
                        availableMoves = this.getAvailableMoves(trigger, upB)
                    }
                } else {
                    if (!!this.state.availableMoves && this.state.availableMoves.includes(trigger)) {
                        var daMove = this.move(this.state.activeSquare, trigger, this.state.boardState, '', movesMade, boardStateHistory, pawnToBePromoted, lightCaptured, darkCaptured) // Will make move change
                        upB = daMove.upB
                        lightK = daMove.lightKing
                        darkK = daMove.darkKing
                        movesMade = daMove.movesMade
                        boardStateHistory = daMove.boardStateHistory
                        rewind = daMove.rewind
                        pawnPromotionState = daMove.pawnPromotionState
                        pawnToBePromoted = daMove.pawnToBePromoted
                        lightCaptured = daMove.lightCaptured
                        darkCaptured = daMove.darkCaptured
                        lEP = daMove.lightEnPassant
                        dEP = daMove.darkEnPassant

                        if (turn === 'light') {
                            if (daMove.darkInCheck) {
                                gameOver = this.checkmated(darkK, upB)
                            }                            
                            if (gameOver) {
                                winner = 'Light'
                                lightScore += 1
                                this.endTimer()
                            }
                        } else if (turn === 'dark') {
                            if (daMove.lightInCheck) {
                                gameOver = this.checkmated(lightK, upB)
                            }
                            if (gameOver) {
                                winner = 'Dark'
                                darkScore += 1
                                this.endTimer()
                            }
                        }

                        lightInCheck = daMove.lightInCheck
                        darkInCheck = daMove.darkInCheck

                        if (!gameOver) {
                            turn = turn === 'light' ? 'dark' : 'light'
                        }

                        availableMoves = undefined;
                    }
                }
            }

            this.setState({
                ...this.state,
                activeSquare: !!availableMoves ? trigger : undefined,
                boardState: upB,
                turn: turn,
                availableMoves: availableMoves,
                gameOver: gameOver,
                winner: winner,
                darkKing: darkK,
                lightKing: lightK,
                lightInCheck: lightInCheck,
                darkInCheck: darkInCheck,
                movesMade: movesMade,
                boardStateHistory: boardStateHistory,
                rewind: rewind,
                pawnPromotionState: pawnPromotionState,
                pawnToBePromoted: pawnToBePromoted,
                lightCaptured: lightCaptured,
                darkCaptured: darkCaptured,
                lightScore: lightScore,
                darkScore: darkScore,
                lightEnPassant: lEP,
                darkEnPassant: dEP,
            })
        }
    }

    infoPanelAction(command) {
        if (command === 'again') {
            var game = this.generateNewGame()

            this.endTimer()
            this.setState({ ...game })
        } else if (command === 'back') {

            var rew = this.state.rewind
            var turn = this.state.turn

            if (rew < (this.state.boardStateHistory.length - 1)) {
                rew = rew + 1
                turn = turn === 'light' ? 'dark' : 'light'
            }

            var bsh = this.state.boardStateHistory[rew]

            this.setState({ 
                ...this.state, 
                activeSquare: undefined,
                rewind: rew,
                boardState: bsh,
                turn: turn
            })
        } else if (command === 'forward') {

            var rew = this.state.rewind
            var turn = this.state.turn

            if (rew > 0) {
                rew = rew - 1
                turn = turn === 'light' ? 'dark' : 'light'
            } else {
                rew = 0
            }

            var bsh = this.state.boardStateHistory[rew]

            this.setState({ 
                ...this.state, 
                activeSquare: undefined,
                rewind: rew,
                boardState: bsh,
                turn: turn
            })
        }
    }

    actionPanelAction(command, color) {
        if (command === 'resign') {
            if(this.state.turn === color && !this.state.gameOver) {
                var lScore = this.state.lightScore
                lScore += color === 'dark' ? 1 : 0

                var dScore = this.state.darkScore
                dScore += color === 'light' ? 1 : 0

                this.endTimer()
                this.setState({ 
                    ...this.state, 
                    activeSquare: undefined,
                    lightResigned: color === 'light',
                    darkResigned: color === 'dark',
                    lightScore: lScore,
                    darkScore: dScore,
                    gameOver: true
                })
            }
        } else if (command === 'draw') {
            if (!this.state.gameOver) {
                if (color === 'light') {
                    var lScore = this.state.lightScore
                    var dScore = this.state.darkScore

                    if (this.state.darkOfferingDraw) {
                        this.endTimer()
                        lScore += .5
                        dScore += .5
                    }

                    this.setState({
                        ...this.state,
                        activeSquare: undefined,
                        lightOfferingDraw: !this.state.lightOfferingDraw,
                        lightScore: lScore,
                        darkScore: dScore,
                        gameOver: this.state.darkOfferingDraw,
                    })
                } else if (color === 'dark') {
                    var lScore = this.state.lightScore
                    var dScore = this.state.darkScore

                    if (this.state.lightOfferingDraw) {
                        this.endTimer()
                        lScore += .5
                        dScore += .5
                    }

                    this.setState({
                        ...this.state,
                        activeSquare: undefined,
                        darkOfferingDraw: !this.state.darkOfferingDraw,
                        lightScore: lScore,
                        darkScore: dScore,
                        gameOver: this.state.lightOfferingDraw,
                    })
                }
            }
        }
    }

    countDown(color) {
        var t = color === 'light' ? this.state.lightTime : this.state.darkTime
        t -= 1

        if (t <= 0) {
            this.setState({
                lightTime: color === 'light' ? t : this.state.lightTime,
                darkTime: color === 'dark' ? t : this.state.darkTime,
                gameOver: true,
                lightScore: color === 'dark' ? this.state.lightScore + 1 : this.state.lightScore,
                darkScore: color === 'light' ? this.state.darkScore + 1 : this.state.darkScore,
                winner: color === 'dark' ? 'Light' : 'Dark'
            })
            this.endTimer()
        } else {
            this.setState({
                lightTime: color === 'light' ? t : this.state.lightTime,
                darkTime: color === 'dark' ? t : this.state.darkTime,
            })
        }
    }

    startTimer(color) {
        if (this.timer === 0) {
            this.timer = setInterval(() => this.countDown(color), 1000)
        }
    }

    endTimer() {
        clearInterval(this.timer)
        this.timer = 0
    }

    render() {
        return (
            <div className="App-header">
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    { this.state.screenWidth > 1200 && this.state.screenHeight > 600 &&
                        <ActionPanel 
                            darkCaptured={this.state.darkCaptured} 
                            lightCaptured={this.state.lightCaptured} 
                            lightDraw={this.state.lightOfferingDraw}
                            darkDraw={this.state.darkOfferingDraw}
                            lightScore={this.state.lightScore ?? 0}
                            darkScore={this.state.darkScore ?? 0}
                            lightTime={this.state.lightTime}
                            darkTime={this.state.darkTime}
                            callback={(command, color) => this.actionPanelAction(command, color)}/>
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <ChessBoard 
                            callback={(trigger) => this.setActiveSquare(trigger)} 
                            boardState={this.state.boardState} 
                            activeSquare={this.state.activeSquare}
                            availableMoves={this.state.availableMoves}
                            disableAction={this.state.gameOver || (this.state.rewind > 0)}
                        />
                        { (this.state.screenWidth < 1200 || this.state.screenHeight < 600) &&
                            <div className='button' tabIndex='1' onClick={() => this.infoPanelAction('again')}>
                                <h3 className='marginless'>play again</h3>
                            </div>
                        }
                    </div>
                    { this.state.screenWidth > 1200 && this.state.screenHeight > 600 &&
                        <InformationPanel
                            callback={(command) => this.infoPanelAction(command)}
                            moves={this.state.movesMade}
                            gameOver={this.state.gameOver}
                            lightInCheck={this.state.lightInCheck}
                            darkInCheck={this.state.darkInCheck}
                            lightResigned={this.state.lightResigned}
                            darkResigned={this.state.darkResigned}
                            lightDraw={this.state.lightOfferingDraw}
                            darkDraw={this.state.darkOfferingDraw}
                            winner={this.state.winner}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Root