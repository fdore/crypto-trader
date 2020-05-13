import styled from "styled-components";
import {
  SvgContainer,
  SvgPath,
} from "core/components/LineChart/LineChart.styled";
import Palette from "theme/style";

export const Container = styled.div<{
  isActive: boolean;
}>`
  cursor: pointer;
  display: grid;
  grid-template-rows: 25px 1fr;
  height: 50px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "currencyPair price"
    "relativeChange change";
  font-size: 12px;
  padding: 5px 10px;
  border: 1px solid
    ${({ isActive }) => (isActive ? Palette.Orange : Palette.Border)};
  position: relative;

  &:hover {
    background-color: #2d3436;
  }

  ${SvgContainer} {
    position: absolute;
    top: 10%;
    left: 0;
    width: 100%;
    height: 80%;
    opacity: 0.6;
    z-index: -1;
    ${SvgPath} {
      stroke: ${Palette.DarkGray};
    }
  }
`;

export const CurrencyPair = styled.div`
  color: ${Palette.White};
  grid-area: currencyPair;
`;

export const Price = styled.div`
  color: ${Palette.White};
  grid-area: price;
  margin-right: 0;
  margin-left: auto;
`;

export const RelativeChange = styled.div<{
  isPositive: boolean;
}>`
  grid-area: relativeChange;
  font-size: 18px;
  color: ${({ isPositive }) =>
    isPositive ? Palette.Positive : Palette.Negative};
  display: flex;
  font-family: FiraSans-Medium;
`;

export const Change = styled.div<{
  isPositive: boolean;
}>`
  grid-area: change;
  margin-right: 0;
  margin-left: auto;
  color: ${({ isPositive }) =>
    isPositive ? Palette.Positive : Palette.Negative};
`;
