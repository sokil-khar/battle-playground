import * as React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import duration from 'humanize-duration';

function processText(a, b, c, txt, weapon = null) {
  let pre = [];
  if (a) {
    pre.push(`[[${a}]]`);
  }

  if (b) {
    pre.push(`%%${b}]]`);
  }

  if (c !== null) {
    pre.push(`%%${c + 1}]]`);
  }

  const append = pre.length ? '(' + pre.join('/') + ') ' : '';

  return (append + txt)
    .replace(/\[\[/g, '<span class="highlight">')
    .replace(/\]\]/g, '</span>')
    .replace(/\^\^/g, '<span class="highlight-stat">')
    .replace(/\|\|/g, '<span class="highlight-value">')
    .replace(/\*\*/g, '<span class="highlight-failed">')
    .replace(/\!\!/g, '<span class="highlight-red">')
    .replace(/\@\@/g, '<span class="highlight-green">')
    .replace(
      /\%\%/g,
      `<span class="highlight-weapon highlight-weapon-${
        weapon ? weapon.getRarity().toLowerCase() : ''
      }">`
    )
    .replace(
      '[damage-type]',
      `<span class="damage damage-${weapon ? weapon.getDamageTypes()[0].toLowerCase() : ''}"></span>`
    );
}

function NestedListItem({ text, items, main }) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding style={{ marginBottom: 20 }}>
          {items
            .filter(({ event }) => !main || event.main)
            .map(({ attackerName, weaponName, weapon, turn, event }) => (
              <ListItem key={Math.random()} sx={{ pl: 4 }} className="nested">
                <ListItemIcon></ListItemIcon>

                <div
                  dangerouslySetInnerHTML={{
                    __html: processText(attackerName, weaponName, turn, event.text, weapon),
                  }}
                ></div>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

export default function NestedReportList({ items, main }) {
  return (
    <div>
      <List sx={{ width: '100%', bgColor: 'background.paper' }} className="report-list">
        {Object.entries(items).map(([t, items], idx) => {
          const date = new Date(+t);

          const time = duration(date);

          return (
            <NestedListItem key={idx} text={`[${time}] Step #${idx}`} main={main} items={items} />
          );
        })}
      </List>
    </div>
  );
}
