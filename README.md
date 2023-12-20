# Value Iteration - Tic Tac Toe
This repository contains a JavaScript implementation of the Value Iteration algorithm applied to the classic game of Tic Tac Toe. This is also
a [GitHub page](https://danilonumeroso.github.io/tic_tac_toe) containing a playable demo if you want to test yourself against a learnt agent :)

## Value Iteration
Value Iteration is a ~~dynamic programming~~ reinforcement learning algorithm commonly used to find the optimal value function for a Markov Decision Process (MDP). 
In this context, it helps the computer player learn an optimal strategy for playing Tic Tac Toe.
### Markov Decision Process (MDP)

Our MDP is defined by a tuple $(S, A, P, R)$, where:

- $S$ is a finite set of states, i.e. all possible Tic Tac Toe games.
- $A$ is a finite set of actions.
- $P$ is the state transition probability function $P: S \times A \times S \rightarrow [0, 1]$, representing the probability of transitioning from one state to another given an action.
  - In the context of Tic Tac Toe, the transision function is deterministic. 
- $R$ is the reward function $R: S \times A \rightarrow \mathbb{R}$, representing the immediate reward received after taking an action in a particular state.
  - For the purpose of learning to play this game, the reward functions gives 1 if the action led to a state where **player X** won the game, -1 if **player O**, 0 if it is a draw and 0.1 otherwise.

### Value Function

The value function $V(s)$ represents the expected cumulative reward from being in state $s$ and following an optimal policy thereafter. The Bellman equation for the value function is given by:

$V(s) = \max_{a \in A} \left( R(s, a) + \gamma \sum_{s' \in S} P(s' \mid s, a) V(s') \right)$

where:
- $R(s, a)$ is the immediate reward for taking action $a$ in state $s$.
- $\gamma$ is the discount factor, a parameter between 0 and 1 that determines the importance of future rewards.
- $\sum_{s' \in S} P(s' \mid s, a) V(s')$ is the expected value of the next state.

### Value Iteration Algorithm for Tic Tac Toe

1. **Initialization**: Initialise the value function $V$ for all states following the reward function.

2. **Iteration**:
   - For each state $s$ in $S$, update the value function using the Bellman equation:
     $V(s) \leftarrow \max_{a \in A} \left( R(s, a) + \gamma \sum_{s' \in S} P(s' \mid s, a) V(s') \right)$
   - This is performed in the function `value_iteration` in `code/src/value_iteration.js`, with slight modifications to learn correct values for both **X** and **O**.

4. **Stopping Criteria**: Repeat step 2 until the change in the value function $\Delta V$ is below a predefined threshold.

5. **Output**: The resulting value function $V^\*$ is the optimal value function, and the optimal policy can be derived from it.

The optimal policy is then obtained by selecting the action that maximizes the expression inside the argmax in the Bellman equation for each state (function `extract_policy` in `code/src/value_iteration.js`): 

$\pi^\*(s) \leftarrow \arg\max_{a \in A} \left( R(s, a) + \gamma \sum_{s' \in S} P(s' \mid s, a) V^\*(s') \right)$

## Acknowledgments
I shamelessly stole the CSS file from [WebDevSimplified](https://github.com/WebDevSimplified/JavaScript-Tic-Tac-Toe/) (many thanks!)
