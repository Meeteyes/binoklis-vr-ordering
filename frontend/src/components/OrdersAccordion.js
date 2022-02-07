import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";

const OrdersAccordion = () => {
  const store = useSelector((store) => store);
  console.log("Store in accardion", store);
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {store.shows.items.map((item, index) => {
        return (
          <Accordion
            key={item.date}
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}bh-content`}
              id={`panel${index + 1}bh-header`}
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {item.date}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {item.city}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {`The shows contact person is: ${item.contactPerson} and the phone number is {item.phone}, e-mail ${item.email}`}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default OrdersAccordion;
