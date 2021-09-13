import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Widget from '../components/widget/Widget';
import {
  mockGetlocationSuccess,
  mockGetlocationError,
  mockAxiosGetSuccess,
  sydneyMockWeatherData,
  mockAxiosGetError,
} from './utils/mocks';

afterEach(cleanup);

jest.mock('axios');

// get html fragment for snapshot testing
let asFragment;

describe('Widget component', () => {
  const initialWidgetTitle = 'title';

  it('should render weather information if user allow to get location in browser', async () => {
    mockAxiosGetSuccess(sydneyMockWeatherData);
    mockGetlocationSuccess();

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(initialWidgetTitle.toUpperCase())).toBeInTheDocument();
    expect(screen.getByTestId('widget-info')).toBeInTheDocument();
  });

  it('show loading when component start loading', () => {
    const rendered = render(<Widget widgetTitle="title" isCelsius showWind />);
    asFragment = rendered.asFragment;

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error message if cannot get position', async () => {
    mockGetlocationError();

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Please try later', { selector: 'p' })).toBeInTheDocument();
  });

  it('renders error message if cannot get weather information', async () => {
    mockGetlocationSuccess();
    mockAxiosGetError();

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Please try later', { selector: 'p' })).toBeInTheDocument();
  });

  it('shows a sunny icon if it is a good day!', async () => {
    mockGetlocationSuccess();
    mockAxiosGetSuccess(sydneyMockWeatherData);

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('img', { name: 'weather-icon' })).toHaveAttribute('src', 'day.svg');
  });

  it('shows a rainy icon if it is a rainy day!', async () => {
    const mockRainyData = { ...sydneyMockWeatherData };
    mockRainyData.weather[0].main = 'Rain';

    mockGetlocationSuccess();
    mockAxiosGetSuccess(mockRainyData);

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('img', { name: 'weather-icon' })).toHaveAttribute('src', 'rainy.svg');
  });

  it('shows a snowy icon if it is a snowy day!', async () => {
    const mockSnowyData = { ...sydneyMockWeatherData };
    mockSnowyData.weather[0].main = 'Snow';

    mockGetlocationSuccess();
    mockAxiosGetSuccess(sydneyMockWeatherData);

    await act(async () => {
      const rendered = render(<Widget widgetTitle={initialWidgetTitle} isCelsius showWind />);
      asFragment = rendered.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('img', { name: 'weather-icon' })).toHaveAttribute('src', 'snowy.svg');
  });
});
