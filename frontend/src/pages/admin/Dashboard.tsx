import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    totalCategories: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const shopsResponse = await axios.get('http://localhost:3001/api/shops')
      const shops = shopsResponse.data
      
      let totalProducts = 0
      let totalCategories = 0
      
      for (const shop of shops) {
        const productsResponse = await axios.get(`http://localhost:3001/api/shops/${shop.id}/products`)
        totalProducts += productsResponse.data.length
        totalCategories += shop.categories.length
      }
      
      setStats({
        totalProducts,
        totalShops: shops.length,
        totalCategories
      })
      setError(null)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger les statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Box>Chargement...</Box>
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>📊 Tableau de Bord</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat p={6} bg="white" borderRadius="md" shadow="sm">
          <StatLabel>Boutiques Actives</StatLabel>
          <StatNumber color="blue.500">{stats.totalShops}</StatNumber>
          <StatHelpText>Brasserie, Salon de thé</StatHelpText>
        </Stat>
        
        <Stat p={6} bg="white" borderRadius="md" shadow="sm">
          <StatLabel>Produits Total</StatLabel>
          <StatNumber color="green.500">{stats.totalProducts}</StatNumber>
          <StatHelpText>Toutes boutiques confondues</StatHelpText>
        </Stat>
        
        <Stat p={6} bg="white" borderRadius="md" shadow="sm">
          <StatLabel>Catégories</StatLabel>
          <StatNumber color="purple.500">{stats.totalCategories}</StatNumber>
          <StatHelpText>4 par boutique</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box p={6} bg="blue.50" borderRadius="md">
        <Heading size="md" mb={4} color="blue.700">
          🎯 Prochaines étapes
        </Heading>
        <Text>
          • Modifier un produit et voir le changement en temps réel<br/>
          • Ajouter les boutiques Cosmétiques et Herboristerie<br/>
          • Implémenter la gestion des catégories<br/>
          • Créer les interfaces vitrines pour tous les univers
        </Text>
      </Box>
    </Box>
  )
}