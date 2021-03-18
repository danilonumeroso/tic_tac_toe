import { is_winner, is_draw, is_x_turn } from './logic'

function is_terminal(state) {
    return is_winner(state, 1) || is_winner(state, -1) || is_draw(state);
}

function is_not_terminal(state) {
    return !is_terminal(state);
}

function get_actions(state) {
    return state.map((value, index) => (value === 0) ? index : -1).filter(index => index !== -1);
}

function* product(...arrays) {
    if (arrays.length === 0) {
        yield [];
    } else {
        const [first, ...rest] = arrays;
        for (const item of first) {
            for (const result of product(...rest)) {
                yield [item, ...result];
            }
        }
    }
}

function all_possible_states() {
    const possible_values = [0, 1, -1];
    const all_states = Array.from(product(...Array(9).fill(possible_values)));

    // 1- No legal Tic Tac Toe states have number_of_o > number_of_x or number_of_x - number_of_o > 1
    const is_valid_state = s => [0, 1].includes((s.filter(v => v === 1).length - s.filter(v => v === -1).length));

    // 2- Filter out all states where both X and O won
    const is_not_both_winners = s => !(is_winner(s, 1) && is_winner(s, -1));

    return all_states.filter(s => is_valid_state(s) && is_not_both_winners(s));
}

function apply_action(action, state) {
    const next_state = [...state]
    next_state[action] = (state.filter(v => v === 1).length > state.filter(v => v === -1).length) ? -1 : 1;
    return next_state;
}

function reward_fn(state) {
    if (is_winner(state, 1)) {
        return 1;
    }

    if (is_winner(state, -1)) {
        return -1;
    }

    if (is_draw(state)) {
        return 0;
    }

    return 0.1;
}

function reset_value_fn(states) {
    const v_fn = new Map();
    for (const s of states) {
        v_fn.set(JSON.stringify(s), reward_fn(s));
    }
    return v_fn;
}

export function value_iteration(discount = 1.0, epsilon = 1e-5, verbose = true) {
    function one_step_value_iteration() {
        let delta = 0;
        for (const s of states.filter(is_not_terminal)) {
            const old_v = v_fn.get(JSON.stringify(s));

            // Switching between maximization and minimization is essential to learn
            // the right values both when playing as X and O
            const aggr_fn = is_x_turn(s) ? Math.max : Math.min;

            // Value Iteration step
            const values = get_actions(s).map(a => reward_fn(apply_action(a, s)) + discount * v_fn.get(JSON.stringify(apply_action(a, s))));
            v_fn.set(JSON.stringify(s), aggr_fn(...values));

            delta = Math.max(delta, Math.abs(v_fn.get(JSON.stringify(s)) - old_v));
        }
        return delta;
    }

    let delta = Number.POSITIVE_INFINITY;
    const states = all_possible_states();
    const v_fn = reset_value_fn(states);

    while (delta > epsilon) {
        delta = one_step_value_iteration();
        if (verbose) {
            console.log(`CONVERGENCE_TEST::delta = ${delta}`);
        }
    }

    return v_fn;
}

export function extract_policy(v_fn) {
    function argmax(array) {
        return array.indexOf(Math.max(...array));
    }

    function argmin(array) {
        return array.indexOf(Math.min(...array));
    }

    function choose_action(s) {
        const actions = get_actions(s);
        const aggr_fn = is_x_turn(s) ? argmax : argmin;
        const values = get_actions(s).map(a => v_fn.get(JSON.stringify(apply_action(a, s))));

        return actions[aggr_fn(values)];
    }

    const policy = new Map();

    for (const s of v_fn.keys()) {
        const s_vec = JSON.parse(s);
        if (is_terminal(s_vec)) {
            continue;
        }

        policy.set(s, choose_action(s_vec));
    }

    return policy;
}

