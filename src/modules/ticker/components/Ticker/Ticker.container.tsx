import { connect } from "react-redux";
import { RootState } from "modules/root";
import { Dispatch } from "redux";
import { SelectionActions } from "modules/selection/actions";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import { getClosePrices } from "modules/candles/selectors";
import { getTicker } from "../../selectors";
import Ticker, { StateProps, DispatchProps } from "./Ticker";

export interface ContainerProps {
  currencyPair: string;
}

const defaultPrices: number[] = [];

const mapStateToProps = (
  state: RootState,
  props: ContainerProps
): StateProps => {
  const { currencyPair } = props;
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const ticker = getTicker(state)(currencyPair);
  const prices =
    selectedCurrencyPair === currencyPair
      ? getClosePrices(state)(currencyPair, "5m")
      : defaultPrices;

  return {
    lastPrice: ticker?.lastPrice,
    currencyPair,
    dailyChangeRelative: ticker?.dailyChangeRelative,
    dailyChange: ticker?.dailyChange,
    isActive: selectedCurrencyPair === currencyPair,
    prices,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: ContainerProps
): DispatchProps => {
  const { currencyPair } = ownProps;

  return {
    onClick: () =>
      dispatch(SelectionActions.selectCurrencyPair({ currencyPair })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ticker);
