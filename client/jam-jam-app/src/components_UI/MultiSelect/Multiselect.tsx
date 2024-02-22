import * as React from "react"
import {useEffect} from "react"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, {SelectChangeEvent} from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import "./MultiSelect.css"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

interface SelectProps {
  dataArray: Array<Object>
  selectedDB: Array<Object>
  selectedCallbackFn: Function
  selectionName: string
  ifRequired: boolean
}

export default function MultiSelect(props: SelectProps | null) {
  const [selectedUI, setSelectedUI] = React.useState<string[]>([])

  useEffect(() => {
    const idArrayDefault: Array<string> = []
    props?.selectedDB.map((selection: any) =>
      idArrayDefault.push(selection[props.selectionName])
    )
    console.log(idArrayDefault)
    setSelectedUI(idArrayDefault)
    //   setSelected(
    //     idArrayDefault.split(","))
    // )
  }, [])

  const handleChange = (event: SelectChangeEvent<typeof selectedUI>) => {
    const {
      target: {value},
    } = event

    console.log()

    const idArray: Array<string> = []
    props?.dataArray.map(
      (selection: any) =>
        value.includes(selection[props.selectionName]) &&
        idArray.push(selection._id)
    )

    const idArrayDefault: Array<string> = []
    props?.selectedDB.map(
      (selection: any) =>
        value.includes(selection[props.selectionName]) &&
        idArrayDefault.push(selection[props.selectionName])
    )

    // console.log(idArrayDefault)

    setSelectedUI(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )

    console.log("selected to cb", idArray)

    props?.selectedCallbackFn(idArray)
    // console.log(dataProps)
  }

  return (
    <>
      {/* <FormControl sx={{m: 1, width: 200, height: 85}}> */}
      <FormControl
        size="small"
        className="multiselectContainer"
        style={{
          marginTop: "20px",

          // margin: "11px 0px 11px 0px ",
          // maxWidth: 200,
        }}
        // sx={{m: 0, width: 200, height: 85}}
      >
        <InputLabel id="demo-multiple-checkbox-label">
          {props?.selectionName || "Select"}
        </InputLabel>
        <Select
          className="oneSelect"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          required={props?.ifRequired}
          value={selectedUI}
          onChange={handleChange}
          input={<OutlinedInput label={props?.selectionName || "Select"} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}>
          {props?.dataArray?.map((name: any) => (
            <MenuItem key={name._id} value={name[props.selectionName]}>
              <Checkbox
                checked={selectedUI.indexOf(name[props.selectionName]) > -1}
              />
              <ListItemText primary={name[props.selectionName]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
