import { HashPair, HashTable } from "./collections.js";

export class WorldState extends HashPair
{
    constructor (_key)
    {
        this.key = _key;
        this.value = 0;
    }
}

export class WorldStates
{
    states; //HashTable

    constructor(_states=[])
    {
        this.states = new HashTable(_states);
    }

    HasState(_key)
    {
        return this.states.ContainsKey(_key);
    }

    AddState(_key, _value)
    {
        this.states.Add(_key, _value);
    }

    ModifyState(_key, _value)
    {
        if (this.states.ContainsKey(_key))
        {
            this.states[_key] += _value;
            if (this.states[_key] <= 0)
                this.RemoveState(_key);
        }
        else
            this.states.Add(_key, _value);
    }

    RemoveState(_key)
    {
        if (this.states.ContainsKey(_key))
        this.states.Remove(_key);
    }

    SetState(_key, _value)
    {
        if (this.states.ContainsKey(_key))
            this.states[_key] = _value;
        else
            this.states.Add(_key, _value);
    }

    GetStates()
    {
        return this.states;
    }
}

export class GAction
{
    actionName = "Action";
    cost = 1.0;
    target;
    targetTag;
    duration = 0;
    preConditions = []; //WorldState[]
    afterEffects = []; //WorldState[]
    agent;

    preconditions;  //Dictionary<string, int>
    effects;        //Dictionary<string, int>

    agentBeliefs; //WorldStates

    running = false;

    constructor()
    {
        this.preconditions = new HashTable();
        this.effects = new HashTable();

    }    

    Awake(_agent)
    {
        this.agent = _agent;

        if (this.preConditions != null)
            for (k in this.preConditions)
            {
                const w = this.preConditions[k];
                this.preconditions.Add(w.key, w.value);
            }

        if (this.afterEffects != null)
            for (k in this.afterEffects)
            {
                const w = this.afterEffects[k];
                this.effects.Add(w.key, w.value);
            }
            
    }

    IsAchievable()
    {
        return true;
    }

    IsAchievableGiven(_conditions) //Dictionary<string, int> 
    {
        for (p in this.preconditions) //KeyValuePair<string, int>
        {
            if (!_conditions.ContainsKey(p.key))
                return false;
        }
        return true;
    }

    PrePerform() {};
    PostPerform() {};
}

export class Node 
{
    parent; //Node
    cost;   //float
    state;  //Dictionary<string, int>
    action; //GAction

    // Constructor
    constructor(_parent, _cost, _allStates, _action) {

        this.parent = _parent;
        this.cost = _cost;
        this.state = new HashTable(_allStates);
        this.action = _action;
    }
}

export class GPlanner 
{
    plan(actions, goal, states) { //GAction[] HashTable WorldStates

        usableActions = [];

        actions.forEach (a =>
        {
            if (a.IsAchievable()) {

                usableActions.Add(a);
            }
        });

        leaves = []; //Node[]
        start = new Node(null, 0.0, GWorld.GetWorld().GetStates(), null);

        success = this.BuildGraph(start, leaves, usableActions, goal);

        if (!success) {

            console.log("NO PLAN");
            return null;
        }

        cheapest = null;
        leaves.forEach (leaf => {

            if (cheapest == null) {

                cheapest = leaf;
            } else if (leaf.cost < cheapest.cost) {

                cheapest = leaf;
            }
        });

        result = []; //GAction
        n = cheapest;

        while (n != null) {

            if (n.action != null) {

                result.Insert(0, n.action);
            }

            n = n.parent;
        }

        queue = []; Queue<GAction>

        result.forEach (a => {

            queue.Enqueue(a);
        });

        console.log("The Plan is: ");
        queue.forEach (a => {

            console.log("Q: " + a.actionName);
        });

        return queue;
    }

    BuildGraph(parent, /* List<Node>  */leaves, /* List<GAction> */ usableActions, /* Dictionary<string, int> */ goal) { //bool

        foundPath = false;
        usableActions.forEach (action => {

            if (action.IsAhievableGiven(parent.state)) {

                currentState = new HashTable(parent.state); //Dictionary<string, int>

                for (effK in action.effects) //KeyValuePair<string, int> 
                { 
                    const eff = action.effects[effK];

                    if (!currentState.ContainsKey(eff.key)) {

                        currentState.Add(eff.key, eff.value);
                    }
                }

                node = new Node(parent, parent.cost + action.cost, currentState, action);

                if (this.GoalAchieved(goal, currentState)) {

                    leaves.Add(node);
                    foundPath = true;
                } else {

                    subset = this.ActionSubset(usableActions, action); //List<GAction>
                    found = this.BuildGraph(node, leaves, subset, goal);

                    if (found) {

                        foundPath = true;
                    }
                }
            }
        });
        return foundPath;
    }

    ActionSubset(actions, removeMe) { //List<GAction>

        subset = []; //List<GAction> 

        actions.forEach (a => {

            if (!a.Equals(removeMe)) {

                subset.Add(a);
            }
        });
        return subset;
    }

    GoalAchieved(goal, state) { //Dictionary<string, int> Dictionary<string, int>

        for (gK in goal) //KeyValuePair<string, int>
        { 
            const g = goal[gK];
            if (!state.ContainsKey(g.Key)) {

                return false;
            }
        }
        return true;
    }
}
