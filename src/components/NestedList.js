import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { ReactComponent as WeaponIcon } from '../icons/cannon.svg';
import { ReactComponent as ShieldIcon } from '../icons/shield.svg';
import { ReactComponent as ServiceIcon } from '../icons/service.svg';

import { ModType } from '../data/constants';
import { Button } from '@mui/material';
import { BattleflyModSetForm } from '../forms/BattleflyModSet';

function ModIcon({ type }) {
  if (type === ModType.Weapon) {
    return <WeaponIcon width="32" height="32" />;
  }

  if (type === ModType.Defense) {
    return <ShieldIcon width="32" height="32" />;
  }

  return <ServiceIcon width="32" height="32" />;
}

function NestedListItem({ text, items }) {
  const [open, setOpen] = React.useState(true);

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
          {items.map((item) => (
            <ListItem key={item.text} sx={{ pl: 4 }}>
              <ListItemIcon>
                <ModIcon type={item.type} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

export default function NestedList({ modSets, onSubmit, items }) {
  const [isAddingModSet, setIsAddingModSet] = React.useState(false);

  const handleSubmit = async (data) => {
    setIsAddingModSet(false);

    await Promise.resolve(onSubmit(data));
  };

  return (
    <div key={Math.random()}>
      <List sx={{ width: '100%', bgColor: 'background.paper' }}>
        {items.map((item, i) => (
          <React.Fragment key={Math.random()}>
            <NestedListItem text={item.text} items={item.items} />

            <Button onClick={() => setIsAddingModSet(modSets[i])}>Edit</Button>
          </React.Fragment>
        ))}
      </List>

      {isAddingModSet && <BattleflyModSetForm data={isAddingModSet} onSubmit={handleSubmit} />}

      {!isAddingModSet && <Button onClick={() => setIsAddingModSet(true)}>Add New Mod Set</Button>}
    </div>
  );
}
