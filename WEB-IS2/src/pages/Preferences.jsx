import React, { useState } from 'react';

const Preferences = () => {
  //falta leer las preferencias al cargar la pagina
  const [isOn11, setIsOn11] = useState(false);
  const [isOn12, setIsOn12] = useState(false);
  const [isOn13, setIsOn13] = useState(false);
  const [isOn21, setIsOn21] = useState(false);
  const [isOn22, setIsOn22] = useState(false);
  const [isOn23, setIsOn23] = useState(false);
  const [isOn31, setIsOn31] = useState(false);
  const [isOn32, setIsOn32] = useState(false);
  const [isOn33, setIsOn33] = useState(false);
  const [isOn41, setIsOn41] = useState(false);
  const [isOn42, setIsOn42] = useState(false);
  const [isOn43, setIsOn43] = useState(false);
  const [isOn51, setIsOn51] = useState(false);
  const [isOn52, setIsOn52] = useState(false);
  const [isOn53, setIsOn53] = useState(false);
  const [isOn61, setIsOn61] = useState(false);
  const [isOn62, setIsOn62] = useState(false);
  const [isOn63, setIsOn63] = useState(false);

  const toggleSwitch = (n) => {
    if(n == 1)  setIsOn11(prevState => !prevState);
    else if(n == 2) setIsOn12(prevState => !prevState);
    else if(n == 3) setIsOn13(prevState => !prevState);
    else if(n == 4) setIsOn21(prevState => !prevState);
    else if(n == 5) setIsOn22(prevState => !prevState);
    else if(n == 6) setIsOn23(prevState => !prevState);
    else if(n == 7) setIsOn31(prevState => !prevState);
    else if(n == 8) setIsOn32(prevState => !prevState);
    else if(n == 9) setIsOn33(prevState => !prevState);
    else if(n == 10) setIsOn41(prevState => !prevState);
    else if(n == 11) setIsOn42(prevState => !prevState);
    else if(n == 12) setIsOn43(prevState => !prevState);
    else if(n == 13) setIsOn51(prevState => !prevState);
    else if(n == 14) setIsOn52(prevState => !prevState);
    else if(n == 15) setIsOn53(prevState => !prevState);
    else if(n == 16) setIsOn61(prevState => !prevState);
    else if(n == 17) setIsOn62(prevState => !prevState);
    else if(n == 18) setIsOn63(prevState => !prevState);
  }

  return (
    <div>
      <h1>Preferencias de actividades</h1>
      <h2>Deportiva</h2>
      <input type="checkbox" id="toggle11" onClick={() => toggleSwitch(1)}></input>
      <label for="toggle11">Individual</label>

      <input type="checkbox" id="toggle12" onClick={() => toggleSwitch(2)}></input>
      <label for="toggle12">Grupal</label>

      <input type="checkbox" id="toggle13" onClick={() => toggleSwitch(3)}></input>
      <label for="toggle13">Virtual</label>

      <h2>Casa</h2>
      <input type="checkbox" id="toggle21" onClick={() => toggleSwitch(4)}></input>
      <label for="toggle21">Individual</label>

      <input type="checkbox" id="toggle22" onClick={() => toggleSwitch(5)}></input>
      <label for="toggle22">Grupal</label>

      <input type="checkbox" id="toggle23" onClick={() => toggleSwitch(6)}></input>
      <label for="toggle23">Virtual</label>

      <h2>Entretenimiento</h2>
      <input type="checkbox" id="toggle31" onClick={() => toggleSwitch(7)}></input>
      <label for="toggle31">Individual</label>

      <input type="checkbox" id="toggle32" onClick={() => toggleSwitch(8)}></input>
      <label for="toggle32">Grupal</label>

      <input type="checkbox" id="toggle33" onClick={() => toggleSwitch(9)}></input>
      <label for="toggle33">Virtual</label>

      <h2>Educativo</h2>
      <input type="checkbox" id="toggle41" onClick={() => toggleSwitch(10)}></input>
        <label for="toggle41">Individual</label>

      <input type="checkbox" id="toggle42" onClick={() => toggleSwitch(11)}></input>
      <label for="toggle42">Grupal</label>

      <input type="checkbox" id="toggle43" onClick={() => toggleSwitch(12)}></input>
      <label for="toggle43">Virtual</label>

      <h2>Recreativa</h2>
      <input type="checkbox" id="toggle51" onClick={() => toggleSwitch(13)}></input>
        <label for="toggle51">Individual</label>

      <input type="checkbox" id="toggle52" onClick={() => toggleSwitch(14)}></input>
      <label for="toggle52">Grupal</label>

      <input type="checkbox" id="toggle53" onClick={() => toggleSwitch(15)}></input>
      <label for="toggle53">Virtual</label>

      <h2>Cocina</h2>
      <input type="checkbox" id="toggle61" onClick={() => toggleSwitch(16)}></input>
        <label for="toggle61">Individual</label>

      <input type="checkbox" id="toggle62" onClick={() => toggleSwitch(17)}></input>
      <label for="toggle62">Grupal</label>

      <input type="checkbox" id="toggle63" onClick={() => toggleSwitch(18)}></input>
      <label for="toggle63">Virtual</label>
    </div>
    
  );
};

export default Preferences;