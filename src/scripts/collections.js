export class HashPair
{
    key; //string
    value; //int
}

export class HashTable 
{
    #table;
    constructor(..._pairs)
    {
        this.#table = [];
        this.#count = 0;
        _pairs.forEach(pair => 
        {
            SetValue(pair.key, pair.value);
        });
    }
    
    Add (_key, _value) 
    {
        SetValue (_key, _value);
    }

    Remove (_key)
    {
        delete this.#table[_key];
    }

    ContainsKey (_key) 
    {
        return this.#table[_key] != undefined;
    }

    GetValue (_key)
    {
        return this.#table[_key];
    }

    SetValue (_key, _value)
    {
        this.#table[_key] = _value;
        this.#count++;
    }
}