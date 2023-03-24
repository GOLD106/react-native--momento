import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { Value } from "react-native-reanimated";
import { scaleX } from "../../core/theme/dimensions";
type SwitchProps = {
    onValueChange: Function,
    userId: String,
    disabled: Boolean,
    activeText: String,
    inActiveText: String,
    backgroundActive: string,
    backgroundInactive: string,
    borderActive: string,
    borderInactive: string,
    value: Boolean,
    circleActiveColor: string,
    circleInActiveColor: string,
    circleBorderActiveColor: string,
    circleBorderInactiveColor: string,
    activeTextStyle: Object,
    inactiveTextStyle: Object,
    containerStyle: Object,
    barHeight: number,
    circleBorderWidth: number,
    innerCircleStyle: Object,
    renderInsideCircle: Function,
    changeValueImmediately: Boolean,
    outerCircleStyle: Object,
    renderActiveText: Boolean,
    renderInActiveText: Boolean,
    switchWidth: number,
    switchHeight: number,
    switchLeftPx: number,
    switchRightPx: number,
    switchWidthMultiplier: number,
    switchBorderRadius: number,
}

const defaultProps = {
    value: false,
    onValueChange: () => null,
    renderInsideCircle: () => null,
    disabled: false,
    userId: '',
    activeText: 'On',
    inActiveText: 'Off',
    backgroundActive: 'green',
    backgroundInactive: 'gray',
    borderActive: 'green',
    borderInactive: 'grey',
    circleActiveColor: 'white',
    circleInActiveColor: 'white',
    circleBorderActiveColor: 'rgb(100, 100, 100)',
    circleBorderInactiveColor: 'rgb(80, 80, 80)',
    switchWidth: 30,
    switchHeight: 30,
    switchBorderRadius: 100,
    barHeight: null,
    circleBorderWidth: 1,
    changeValueImmediately: true,
    innerCircleStyle: { alignItems: 'center', justifyContent: 'center' },
    outerCircleStyle: {},
    renderActiveText: true,
    renderInActiveText: true,
    switchLeftPx: 4,
    switchRightPx: 4,
    switchWidthMultiplier: 2,
    testID: null,
}

export const CustomSwitch = (props: SwitchProps) => {

    const [value, setValue] = useState(props.value);
    let animationValue = value ? scaleX(30) : scaleX(0)
    const [transformSwitch, setTransformSwitch] = useState(new Animated.Value(animationValue));
    const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(value ? scaleX(30) : scaleX(0)));
    const [circleColor, setCircleColor] = useState(new Animated.Value(value ? scaleX(30) : scaleX(0)));
    const [circleBorderColor, setCircleBorderColor] = useState(new Animated.Value(value ? scaleX(30) : scaleX(0)));


    useEffect(() => {       
        console.log(value,'value123', props.value)
        animateSwitch(value, () => setValue(value));
    }, []);

    useEffect(() => {       
        animateSwitch(value, () => setValue(value));
    }, [value]);


    const handleSwitch = () => {
        const {
            onValueChange,
            userId,
            disabled,
            changeValueImmediately,
            value: propValue,
        } = props;

        if (disabled) {
            return;
        }

        if (changeValueImmediately) {
            animateSwitch(!value);
            onValueChange(!value, userId);
        } else {
            animateSwitch(!value, () =>
                setValue(!value),
            );
        }
    };

    const animateSwitch = (value: any, cb = () => { }) => {
        Animated.parallel([
            Animated.spring(transformSwitch, {
                toValue: value
                    ? scaleX(30)
                    : scaleX(0),
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColor, {
                toValue: value ? scaleX(30) : scaleX(0),
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(circleColor, {
                toValue: value ? scaleX(30) : scaleX(0),
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(circleBorderColor, {
                toValue: value ? scaleX(30) : scaleX(0),
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(cb);
        props.onValueChange(value, props?.userId);
    };




    const {
        backgroundActive,
        backgroundInactive,
        circleActiveColor,
        circleInActiveColor,
        activeText,
        inActiveText,
        switchWidth,
        switchHeight,
        containerStyle,
        activeTextStyle,
        inactiveTextStyle,
        barHeight,
        circleBorderInactiveColor,
        circleBorderActiveColor,
        circleBorderWidth,
        innerCircleStyle,
        outerCircleStyle,
        renderActiveText,
        renderInActiveText,
        renderInsideCircle,
        switchWidthMultiplier,
        switchBorderRadius,
        ...restProps
    } = props;

    const interpolatedColorAnimation = backgroundColor.interpolate({
        inputRange: [0, 30],
        outputRange: [backgroundInactive, backgroundActive],
    });

    const interpolatedCircleColor = circleColor.interpolate({
        inputRange: [0, 30],
        outputRange: [circleInActiveColor, circleActiveColor],
    });

    const interpolatedCircleBorderColor = circleBorderColor.interpolate({
        inputRange: [0, 30],
        outputRange: [circleBorderInactiveColor, circleBorderActiveColor],
    });

    return (
        <TouchableOpacity onPress={handleSwitch} >
            <Animated.View
                style={[
                    styles.container,
                    value && styles.activeStyle,
                    containerStyle,
                    {
                        backgroundColor: interpolatedColorAnimation,
                        width: switchWidth * switchWidthMultiplier,
                        height: barHeight || switchHeight,
                        borderRadius: switchBorderRadius,
                    },
                ]}>
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        {
                            left: transformSwitch,
                            width: scaleX(21) * switchWidthMultiplier,
                        },
                        outerCircleStyle,
                    ]}>
                    {value && renderActiveText && (
                        <Text style={[styles.text, styles.paddingRight, activeTextStyle]}>
                            {activeText}
                        </Text>
                    )}

                    <Animated.View
                        style={[
                            styles.circle,
                            {
                                borderWidth: circleBorderWidth,
                                borderColor: interpolatedCircleBorderColor,
                                backgroundColor: interpolatedCircleColor,
                                
                            },
                            innerCircleStyle,
                        ]}>
                        {renderInsideCircle()}
                    </Animated.View>
                    {!value && renderInActiveText && (
                        <Text
                            style={[styles.text, styles.paddingLeft, inactiveTextStyle]}>
                            {inActiveText}
                        </Text>
                    )}
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );

}

CustomSwitch.defaultProps = defaultProps

const styles = StyleSheet.create({
    container: {
        width: scaleX(52),
        height: scaleX(25),
        borderRadius: scaleX(30),
        borderWidth: 1,
        borderColor: '#82848F36'
    },
    activeStyle: {
        // borderColor: '#5ADBED73',
    },
    animatedContainer: {
        flex: 1,
        width: scaleX(21),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    circle: {
        width: scaleX(21),
        height: scaleX(21),
        borderRadius: scaleX(11),
        backgroundColor: '#5ADBED',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    paddingRight: {
        paddingRight: scaleX(5),
    },
    paddingLeft: {
        paddingLeft: scaleX(5),
    },
});
