import { Text, Button, SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";

const dischargeRequest = () => {
  // Timepicker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentPicker, setPicker] = useState<"start" | "end">("start");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentPicker === "start") {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const showDatepickerStart = () => {
    setShow(true);
    setPicker("start");
  };

  const showDatepickerEnd = () => {
    setShow(true);
    setPicker("end");
  };

  return (
    <SafeAreaView>
      <Button onPress={showDatepickerStart} title="Start date!" />
      <Text>selected: {startDate.toLocaleDateString()}</Text>
      <Button onPress={showDatepickerEnd} title="End date!" />
      <Text>selected: {endDate.toLocaleDateString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

export default dischargeRequest;
