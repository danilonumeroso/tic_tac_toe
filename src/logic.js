
export function is_winner(board, player) {
    const winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winning_combinations) {
        if (combination.every(index => board[index] === player)) {
            return true;
        }
    }

    return false;
}

export function is_draw(board) {
    return !board.includes(0);
}

export function is_x_turn(state) {
    const count_x = state.filter(value => value === 1).length;
    const count_o = state.filter(value => value === -1).length;
    return count_x === count_o;
}
