import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

type BarChartProps = {
  labels: string[];
  data: number[];
  width: number;
  height: number;
  color?: string;
};

export function WorkoutBarChart({ labels, data, width, height, color = '#D3FF00' }: BarChartProps) {
  const chartHeight = height - 36;
  const chartWidth = width - 28;
  const maxValue = Math.max(...data, 1);
  const barWidth = chartWidth / data.length - 10;
  const startX = 12;

  return (
    <View>
      <Svg width={width} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = 12 + (1 - step) * chartHeight;
          return (
            <Line
              key={step}
              x1={startX}
              x2={chartWidth + startX}
              y1={y}
              y2={y}
              stroke="#29384A"
              strokeDasharray="4 6"
            />
          );
        })}

        {data.flatMap((value, index) => {
          const x = startX + index * (chartWidth / data.length) + 6;
          const barHeight = (value / maxValue) * chartHeight;
          const y = 12 + chartHeight - barHeight;

          return (
            [
              <Rect key={`bar-${index}`} x={x} y={y} width={barWidth} height={barHeight} rx={8} fill={color} opacity={0.9} />,
              <SvgText key={`label-${index}`} x={x + barWidth / 2} y={height - 8} textAnchor="middle" fill="#929B91" fontSize={11}>
                {labels[index] ?? ''}
              </SvgText>,
            ]
          );
        })}
      </Svg>
    </View>
  );
}

type LineChartProps = {
  labels: string[];
  data: number[];
  width: number;
  height: number;
  color?: string;
};

export function WorkoutLineChart({ labels, data, width, height, color = '#D3FF00' }: LineChartProps) {
  const chartHeight = height - 42;
  const chartWidth = width - 24;
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = Math.max(maxValue - minValue, 1);

  const points = data.map((value, index) => {
    const x = 12 + (index / (data.length - 1)) * chartWidth;
    const y = 18 + chartHeight - ((value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  });

  return (
    <View>
      <Svg width={width} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = 18 + (1 - step) * chartHeight;
          return <Line key={step} x1={12} x2={chartWidth + 12} y1={y} y2={y} stroke="#29384A" strokeDasharray="4 6" />;
        })}
        <Polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {data.flatMap((value, index) => {
          const x = 12 + (index / (data.length - 1)) * chartWidth;
          const y = 18 + chartHeight - ((value - minValue) / range) * chartHeight;
          return (
            [
              <Circle key={`point-${index}`} cx={x} cy={y} r={4} fill={color} />,
              <SvgText key={`label-${index}`} x={x} y={height - 10} textAnchor="middle" fill="#929B91" fontSize={11}>
                {labels[index] ?? ''}
              </SvgText>,
            ]
          );
        })}
      </Svg>
    </View>
  );
}
