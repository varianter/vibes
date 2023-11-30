// @ts-ignore

import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

// Docs: https://headlessui.com/react/combobox
// TODO: Bruk liste over projekter/engasjement
const people = [
  "Durward Reynolds",
  "Kenton Towne",
  "Therese Wunsch",
  "Benedict Kessler",
  "Katelyn Rohan",
];

// TODO: Rename :)
export default function Example() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase());
        });

  // TODO: Gjør pent..... :')
  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredPeople.map((person) => (
          <Combobox.Option key={person} value={person}>
            {person}
          </Combobox.Option>
        ))}
        <Combobox.Option value={"AddNew"}>Legg til ny kunde</Combobox.Option>
      </Combobox.Options>
    </Combobox>
  );
}
