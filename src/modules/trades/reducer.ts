import { TRANSPORT_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat, isSubscriptionMessage, isUnsubscriptionMessage, isErrorMessage } from 'core/transport/utils';
import { ReceiveMessage } from 'core/transport/actions';
import { Actions } from './../root';
import { Trade } from './types/Trade';

type SymbolState = Trade[];

export interface TradesState {
    [currencyPair: string]: SymbolState;
}

const initialState: TradesState = {
}

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
    const [, trades] = action.payload;
    return trades.map(([id, timestamp, amount, price]: number[]) => ({
        id,
        timestamp,
        amount,
        price
    }));
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
    const [, , trade] = action.payload;
    const [id, timestamp, amount, price] = trade;
    const existingTradeIndex = state.findIndex(x => x.id === id);
    const newOrUpdatedTrade = {
        id,
        timestamp,
        amount,
        price
    };

    if (existingTradeIndex >= 0) {
        const updatedState = state.slice();
        updatedState.splice(existingTradeIndex, 1, newOrUpdatedTrade);
        return updatedState;
    } else {
        return [
            ...state,
            newOrUpdatedTrade
        ];
    }
}

export function tradesReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE: {
            if (isHeartbeat(action) || isSubscriptionMessage(action) || isErrorMessage(action)) {
                return state;
            }

            const { channel, request } = action.meta || {};
            if (channel === 'trades') {
                const { symbol } = request;    
                const currencyPair = symbol.slice(1);
                if (isUnsubscriptionMessage(action)) {
                    const updatedState = {
                        ...state
                    };
                    delete updatedState[currencyPair];
                    return updatedState;
                }     

                const symbolReducer = Array.isArray(action.payload[1]) ? snapshotReducer : updateReducer;
                const result = symbolReducer(state[currencyPair], action);

                return {
                    ...state,
                    [currencyPair]: result
                };
            }

            return state;
        }

        default:
            return state;
    }
}

export default tradesReducer;