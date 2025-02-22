import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';

interface TextProps extends TextInputProps {
  label: string;
}

interface ChipProps<T extends number | string> {
  label: string;
  selected?: T;
  onChange?: (value: T) => void;
  options: {label: string; value: T}[];
}

const FormElements = ({...props}: ViewProps) => {
  return <View {...props}>{props.children}</View>;
};

FormElements.Text = ({label, style, ...props}: TextProps) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={'#555'}
        {...props}
      />
    </View>
  );
};

FormElements.ChipGroup = <T extends number | string>({
  label,
  options,
  selected,
  onChange,
}: ChipProps<T>) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.chipGroup}>
        {options.map(option => (
          <Text
            key={option.value}
            style={[
              styles.chip,
              selected === option.value && styles.chipSelected,
            ]}
            onPress={() => onChange?.(option.value)}>
            {option.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 16,
    color: '#333',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 64,
    color: '#333',
    width: 'auto',
  },
  chipSelected: {
    borderColor: '#006FE6',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default FormElements;
