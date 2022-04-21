import React, { useEffect, useState } from 'react';

import { Autocomplete, Button, Paper, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { TextInput } from '../components/TextInput';
import { FormErrors } from '../components/FormErrors';

import { SelectInput } from '../components/SelectInput';
import { Checkbox } from '../components/Checkbox';
import { StatsData } from '../data/constants';

function UpdateStatForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: '',
      attributeTarget: null,
      percentage: false,
      damageTypes: [],
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch, setValue } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);
    fields.attributeTarget = fields.attributeTarget || null;
    fields.damageTypes = fields.damageTypes?.length ? fields.damageTypes : null;

    data.data = fields;
  }, [data, fields]);

  const stats = Object.fromEntries(
    Object.entries(StatsData)
      .map(([key, value]) => [key, value.name])
      .concat([
        ['damagePerFire', 'Damage'],
        ['reload', 'Speed'],
      ])
  );

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Update Stat Effect
        </Typography>

        <SelectInput
          label="Stat Name"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Stat Value" fullWidth />

        <Checkbox name="percentage" control={control} label="Percentage?" />

        {fields.attributeName === 'damagePerFire' && (
          <SelectInput
            label="Target"
            name="attributeTarget"
            control={control}
            options={{ '': 'Empty', Shield: 'Shield' }}
            fullWidth
          />
        )}

        {fields.attributeName === 'eva' && (
          <Autocomplete
            disablePortal
            options={['Electric', 'Kinetic', 'Nuclear', 'Energy', 'Missile']}
            renderInput={(params) => <TextField {...params} label="Damage Types" fullWidth />}
            value={fields.damageTypes || []}
            onChange={(_, value) => {
              setValue(`damageTypes`, value);
            }}
            fullWidth
            multiple
          />
        )}

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function DamageChangeDebuffForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      times: 1,
      change: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.times = parseFloat(fields.times);
    fields.change = parseFloat(fields.change);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Update Next Enemy Attack Damage
        </Typography>

        <TextInput name="times" control={control} label="Count of attacks" fullWidth />

        <TextInput name="change" control={control} label="Damage Change" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function ArmorDamageForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      arm: 1,
      dmg: 10,
      percentage: false,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.arm = parseFloat(fields.arm);
    fields.dmg = parseFloat(fields.dmg);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Damage Depends On Armor
        </Typography>

        <TextInput name="dmg" control={control} label="Damage Points" fullWidth />

        <Checkbox name="percentage" control={control} label="Percentage?" />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function BattleflyStatForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
      percentage: false,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);

    data.data = fields;
  }, [data, fields]);

  const stats = Object.fromEntries(
    Object.entries(StatsData).map(([key, value]) => [key, value.name])
  );

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Battlefly Stat Bonus
        </Typography>

        <SelectInput
          label="Stat"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Values" fullWidth />

        <Checkbox name="percentage" control={control} label="Percentage?" />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function ModStatForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
      percentage: false,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    reload: 'Speed',
    damagePerFire: 'Damage',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Mod Stat Bonus
        </Typography>

        <SelectInput
          label="Stat"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Values" fullWidth />

        <Checkbox name="percentage" control={control} label="Percentage?" />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function FreezeDebuffForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      duration: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.duration = parseFloat(fields.duration);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Freeze Debuff
        </Typography>

        <TextInput name="duration" control={control} label="Duration (in seconds)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function BurnDebuffForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      damage: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.damage = parseFloat(fields.damage);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Burn Debuff
        </Typography>

        <TextInput name="damage" control={control} label="Damage (per second)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function RevertAttackForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      chance: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.chance = parseFloat(fields.chance);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Revert Attack Chance
        </Typography>

        <TextInput name="chance" control={control} label="Chance (%)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function UpdateCharacteristicForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    sensorsArray: 'Sensors Array',
    fusionBattery: 'Fusion Battery',
    engines: 'Engines',
    nanoFrame: 'Nano Frame',
    cpu: 'CPU',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Battlefly Characteristic Bonus
        </Typography>

        <SelectInput
          label="Characteristic"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Values" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function DamageTypeForm({ data }) {
  console.log(data)
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
      percentage: false
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    Energy: 'Energy',
    Kinetic: 'Kinetic',
    Nuclear: 'Nuclear',
    Missile: 'Missile',
    Electric: 'Electric',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Battlefly Damage Type Bonus
        </Typography>

        <SelectInput
          label="Damage Type"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Values" fullWidth />
        <Checkbox name="percentage" control={control} label="Percentage?" />
        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function OtherDamageTypeForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    Energy: 'Energy',
    Kinetic: 'Kinetic',
    Nuclear: 'Nuclear',
    Missile: 'Missile',
    Electric: 'Electric',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Battlefly Other Damage Type Bonus
        </Typography>

        <SelectInput
          label="Damage Type"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Values" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function MaxUsageForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      value: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.value = parseFloat(fields.value);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Weapon Max Usage
        </Typography>

        <TextInput name="value" control={control} label="Count" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function MaxHealthDamageForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      value: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.value = parseFloat(fields.value);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Damage Depends On Max Health
        </Typography>

        <TextInput name="value" control={control} label="Max Health (%)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function DamageBothForm() {
  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Damage Both BFs
        </Typography>
      </Paper>
    </div>
  );
}

function FirstAttackForm() {
  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Defense Until First Attack
        </Typography>
      </Paper>
    </div>
  );
}

function CancelAttackDebuffForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      damageType: '',
      times: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.times = parseFloat(fields.times);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    Energy: 'Energy',
    Kinetic: 'Kinetic',
    Nuclear: 'Nuclear',
    Missile: 'Missile',
    Electric: 'Electric',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Cancel first N attacks
        </Typography>

        <SelectInput
          label="Damage Type"
          name="damageType"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="times" control={control} label="Times" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function FullRecoverChanceForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      chance: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.chance = parseFloat(fields.chance);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Full Recover Chance After Damage
        </Typography>

        <TextInput name="chance" control={control} label="Chance (%)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function SufferForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      damage: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.damage = parseFloat(fields.damage);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Linked Suffer After Damage
        </Typography>

        <TextInput name="damage" control={control} label="Damage" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function ReviveForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      healthPercentage: 0,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.healthPercentage = parseFloat(fields.healthPercentage);

    data.data = fields;
  }, [data, fields]);

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Single-Use Revive
        </Typography>

        <TextInput name="healthPercentage" control={control} label="Health (%)" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

function UpdateModStatDebuffForm({ data }) {
  function getDefaultValues(item) {
    const defaultValues = {
      attributeName: '',
      attributeValue: 0,
      healthPercentage: 30,
    };
    if (!data) {
      return defaultValues;
    }

    return Object.assign(defaultValues, item.data);
  }

  const { control, formState, watch } = useForm({
    defaultValues: getDefaultValues(data),
  });

  const fields = watch();
  useEffect(() => {
    fields.attributeValue = parseFloat(fields.attributeValue);
    fields.healthPercentage = parseFloat(fields.healthPercentage);

    data.data = fields;
  }, [data, fields]);

  const stats = {
    reload: 'Speed',
    damagePerFire: 'Damage',
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Mod Stat Depends on Health
        </Typography>

        <SelectInput
          label="Stat"
          name="attributeName"
          control={control}
          options={stats}
          fullWidth
        />

        <TextInput name="attributeValue" control={control} label="Value" fullWidth />

        <TextInput name="healthPercentage" control={control} label="Health Percentage" fullWidth />

        <FormErrors state={formState} />
      </Paper>
    </div>
  );
}

const effects = {
  UpdateStat: {
    form: UpdateStatForm,
    label: 'Update Stat',
  },
  DamageTimeDebuff: {
    form: DamageChangeDebuffForm,
    label: 'Update Next Enemy Attack Damage',
  },
  ArmorDamage: {
    form: ArmorDamageForm,
    label: 'Damage Depends On Armor',
  },
  BattleflyStat: {
    form: BattleflyStatForm,
    label: 'Battlefly Stat Bonus',
  },
  ModStat: {
    form: ModStatForm,
    label: 'Mod Stat Bonus',
  },
  FreezeDebuff: {
    form: FreezeDebuffForm,
    label: 'Freeze Debuff',
  },
  BurnDebuff: {
    form: BurnDebuffForm,
    label: 'Burn Debuff',
  },
  RevertAttack: {
    form: RevertAttackForm,
    label: 'Revert Attack Chance',
  },
  UpdateCharacteristic: {
    form: UpdateCharacteristicForm,
    label: 'Battlefly Characteristic Bonus',
  },
  DamageType: {
    form: DamageTypeForm,
    label: 'Battlefly Damage Type Bonus',
  },
  OtherDamageType: {
    form: OtherDamageTypeForm,
    label: 'Battlefly Secondary Damage Type Bonus',
  },
  MaxUsage: {
    form: MaxUsageForm,
    label: 'Weapon Max Usage',
  },
  MaxHealthDamage: {
    form: MaxHealthDamageForm,
    label: 'Damage Depends On Max Health',
  },
  DamageBoth: {
    form: DamageBothForm,
    label: 'Damage Both BFs',
  },
  FirstAttackShield: {
    form: FirstAttackForm,
    label: 'Defense Until First Attack',
  },
  CancelAttackDebuff: {
    form: CancelAttackDebuffForm,
    label: 'Cancel first N attacks',
  },
  CanFullRecover: {
    form: FullRecoverChanceForm,
    label: 'Full Recover Chance After Damage',
  },
  Suffer: {
    form: SufferForm,
    label: 'Linked Suffer After Damage',
  },
  Resurrect: {
    form: ReviveForm,
    label: 'Single-Use Revive',
  },
  UpdateModStatDebuff: {
    form: UpdateModStatDebuffForm,
    label: 'Mod Stat Depends on Health',
  },
};

export const ModEffectsForm = ({ items = [], onSubmit }) => {
  const [state, setState] = useState(items);
  const [currentEffectData, setCurrentEffectData] = useState(null);

  const { control, formState, watch } = useForm({
    defaultValues: {
      currentEffect: '',
    },
  });

  const currentEffect = watch('currentEffect');
  useEffect(() => {
    if (!currentEffectData) return;

    currentEffectData.type = currentEffect;
  }, [currentEffect, currentEffectData]);

  const options = Object.fromEntries(
    Object.entries(effects).map(([key, value]) => [key, value.label])
  );

  const onAddNewEffect = () => {
    setState((state) => [...state, currentEffectData]);

    setCurrentEffectData(null);
  };

  const onEffectDelete = (item) => () => {
    setState((state) => state.filter((effect) => effect !== item));
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography paragraph variant="h5">
          Mod Effects
        </Typography>

        {state.map((item) => (
          <div key={Math.random()} style={{ display: 'flex', flexDirection: 'column' }}>
            <FormShow type={item.type} data={item} />
            <Button
              onClick={onEffectDelete(item)}
              variant="contained"
              style={{ alignSelf: 'end', marginBottom: 20 }}
              color="error"
            >
              Delete
            </Button>
          </div>
        ))}

        <form>
          {currentEffectData && (
            <div>
              <SelectInput
                label="Effect"
                name="currentEffect"
                control={control}
                options={options}
                fullWidth
              />

              <FormShow type={currentEffect} data={currentEffectData} />

              <Button onClick={onAddNewEffect}>Add New</Button>
            </div>
          )}

          {!currentEffectData && (
            <Button onClick={() => setCurrentEffectData({ type: null, data: null })}>
              Add Effect
            </Button>
          )}

          <FormErrors state={formState} />

          <Button type="button" variant="contained" onClick={() => onSubmit(state)}>
            Save
          </Button>
        </form>
      </Paper>
    </div>
  );
};

function FormShow({ type, data }) {
  const Component = effects[type]?.form;
  if (!Component) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <Component data={data} />
    </div>
  );
}
