
  const canCreateNewUniverse = useCallback(() => {
    return state.drops.length >= 100;
  }, [state.drops.length]);
